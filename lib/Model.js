const { Model } = require('tangjs')
const ORM = require('./ORM')
const Schema = require('./Schema')
const mergeDefaultTree = require('./helpers/mergeDefaultTree')
const { AQL, ERRORS, HOOKS, METHODS, RETURN } = require('./consts')

require('colors')

class OrangoModel extends Model {
  static documentId(key) {
    return this.collectionName + AQL.DIVIDER + key
  }

  static hasMany(modelName) {
    if(!this._hasMany) {
      this._hasMany = []
    }
    this._hasMany.push(modelName)
    return this
  }

  static belongsTo(modelName) {
    if(!this._belongsTo) {
      this._belongsTo = []
    }
    this._belongsTo.push(modelName)
    return this
  }

  static insert(model) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.method(METHODS.INSERT)
    orm.model(this)
    orm.data(model)
    orm.collection(collection)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static create(model) {
    return this.insert(model)
  }

  static findByIdAndUpdate(id, data) {
    if (!id) {
      throw new Error(ERRORS.ID_REQUIRED)
    }
    return this.updateOne(
      {
        _key: id.split(AQL.DIVIDER).pop()
      },
      data
    ).return(RETURN.DOC)
  }

  static updateOne(filter = {}, data, options = {}) {
    // TODO: options{ upsert: true }
    return this.updateMany(filter, data).limit(1).one()
  }

  static update(filter = {}, data) {
    return this.updateMany(filter, data)
  }

  static updateMany(filter = {}, data) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.method(METHODS.UPDATE)
    orm.model(this)
    orm.filter(filter)
    orm.data(data)
    orm.collection(collection)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static findByIdAndDelete(id) {
    if (!id) {
      throw new Error(ERRORS.ID_REQUIRED)
    }
    return this.deleteOne({
      _key: id.split(AQL.DIVIDER).pop()
    }).return(RETURN.DOC)
  }

  static deleteOne(filter = {}) {
    return this.deleteMany(filter).limit(1).one()
  }

  static delete(filter = {}) {
    return this.deleteMany(filter)
  }

  static deleteMany(filter = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.method(METHODS.DELETE)
    orm.model(this)
    orm.filter(filter)
    orm.collection(collection)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static getCollection() {
    if (!this.orango.connection.connected) {
      throw new Error(ERRORS.NOT_CONNECTED)
    }

    let db = this.orango.connection.db
    if (this.schema.options.edge) {
      return db.edgeCollection(this.collectionName)
    }
    return db.collection(this.collectionName)
  }

  static findById(id) {
    if (!id) {
      throw new Error(ERRORS.ID_REQUIRED)
    }

    let orm = this.findOne({
      _key: id.split(AQL.DIVIDER).pop()
    })
    orm.method(METHODS.DOCUMENT)
    return orm
  }

  static findOne(filter = {}) {
    return this.find(filter).return(RETURN.DOC).one()
  }

  static find(filter = {}) {
    return this.findMany(filter)
  }

  static findMany(filter = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.method(METHODS.FIND)
    orm.model(this)
    orm.filter(filter)
    orm.collection(collection)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    orm.return()
    return orm
  }

  static findByQuery(query) {
    // replace @@Model with the collection name of the model
    query = query.replace(/@@([A-Z]\w+)/g, (match, p1) => {
      return this.orango.model(p1).collectionName
    })

    let collection = this.getCollection()
    let orm = new ORM()
    orm.method(METHODS.FIND)
    orm.model(this)
    orm.customQuery(query)
    orm.collection(collection)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    orm.return()
    return orm
  }

  static findByEdge(EdgeModel, id, options = {}) {
    let inbound = this.collectionName === this.orango.model(EdgeModel.schema.from).collectionName

    inbound = options.hasOwnProperty('outbound') ? options.outbound === false : inbound

    let boundCollection = inbound
      ? this.orango.model(EdgeModel.schema.to).collectionName
      : this.orango.model(EdgeModel.schema.from).collectionName

    let filter = {
      collection: EdgeModel.collectionName,
      id: boundCollection + AQL.DIVIDER + id, //this.documentId(id),
      inbound
    }

    let orm = new ORM()
    orm.method(METHODS.FIND_EDGE)
    orm.filter(filter)
    orm.model(this)
    orm.options(options)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    orm.return()

    return orm
  }

  static count(filter = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.method(METHODS.COUNT)
    orm.model(this)
    orm.filter(filter)
    orm.collection(collection)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static truncate() {
    return new Promise(async (resolve) => {
      let collection = this.getCollection()
      let result = await collection.truncate()
      return resolve(result)
    })
  }

  static importMany(docs, truncate = false) {
    this.emit(HOOKS.IMPORT, {
      model: this,
      data: docs
    })

    return new Promise(async (resolve) => {
      let collection = this.getCollection()
      if (truncate) {
        await collection.truncate()
      }
      let results = await collection.import(docs)

      this.emit(HOOKS.IMPORTED, {
        model: this,
        data: results
      })

      return resolve(results)
    })
  }

  /**
   * @param {String} from
   * @param {String} to
   */
  static link(from, to) {
    if (!this.schema.isEdge) {
      throw new Error(ERRORS.EDGE_MODEL_REQUIRED)
    }

    this.emit(HOOKS.LINK, {
      model: this,
      data: { from, to }
    })

    if (!this.schema.isEdge) {
      return reject(new Error(ERRORS.EDGE_MODEL_REQUIRED))
    }

    let item = new this(from, to)
    return item.save().then(
      (result) => {
        this.emit(HOOKS.LINKED, {
          model: this,
          data: { from, to }
        })
        return result
      },
      (e) => {
        return e
      }
    )
  }

  static unlink(from, to) {
    if (!this.schema.isEdge) {
      throw new Error(ERRORS.EDGE_MODEL_REQUIRED)
    }

    this.emit(HOOKS.UNLINK, {
      model: this,
      data: { from, to }
    })

    const orm = new ORM()
    const collection = this.getCollection()
    orm.method(METHODS.UNLINK)
    orm.model(this)
    orm.collection(collection)
    orm.connection(this.orango.connection)
    orm.options({ from, to })

    if (from && to) {
      orm.limit(1)
      orm.one()
      orm.filter({
        _from: this.orango.model(this.schema.from).collectionName + AQL.DIVIDER + from,
        _to: this.orango.model(this.schema.to).collectionName + AQL.DIVIDER + to
      })
    } else if (from) {
      orm.filter({
        _from: this.orango.model(this.schema.from).collectionName + AQL.DIVIDER + from
      })
    } else if (to) {
      orm.filter({
        _to: this.orango.model(this.schema.to).collectionName + AQL.DIVIDER + to
      })
    }

    return orm
  }

  constructor(data = {}, schema = {}) {
    if (!(schema instanceof Schema)) {
      schema = new Schema(schema)
    }
    mergeDefaultTree(data, schema._defaultData)
    super(data, schema)

    let id = data.id || data._key
    if (id) {
      delete data.id
      delete data._key
      this.id(id)
    }
  }

  _removeKeys() {
    delete this._id
    delete this._key
    delete this._rev
  }

  get isNew() {
    return !this._id
  }

  get collection() {
    return this.constructor.getCollection()
  }

  id(val) {
    if (val) {
      this._key = val
      this._id = this.constructor.collectionName + AQL.DIVIDER + val
    }
    return this._key
  }

  save(options = {}) {
    if (this.constructor.orango.connection.connected) {
      if (options.saveAsNew) {
        this._removeKeys()
      }

      if ((this.isNew || options.isNew) && !options.update) {
        return this.constructor.insert(this, options)
      }

      return this.constructor.updateOne({ _key: this._key }, this, options)
    }
  }

  async remove() {
    if (!this.isNew) {
      const collection = this.constructor.getCollection()
      let result
      try {
        result = await collection.remove(this._key)
        if (result) {
          this._removeKeys()
        }
        this.emit('removed', result)
      } catch (e) {}
      return result
    }
  }
}

module.exports = OrangoModel
