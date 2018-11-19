const { Model } = require('tangjs')
const ORM = require('./ORM')
const Schema = require('./Schema')
const mergeDefaultTree = require('./helpers/mergeDefaultTree')
const { ACTIONS, AQL, ERRORS, HOOKS, RETURN } = require('./consts')

require('colors')

class OrangoModel extends Model {
  static documentId(key) {
    return this.collectionName + AQL.DIVIDER + key
  }

  static insert(model) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action(ACTIONS.INSERT)
    orm.model(this)
    orm.data(model)
    orm.collection(collection)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    return orm
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
    ).return(RETURN.NEW_DOC)
  }

  static updateOne(criteria = {}, data) {
    return this.updateMany(criteria, data).limit(1)
  }

  static updateMany(criteria = {}, data) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action(ACTIONS.UPDATE)
    orm.model(this)
    orm.criteria(criteria)
    orm.data(data)
    orm.collection(collection)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    orm.return(RETURN.DOC)
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

  static deleteOne(criteria = {}) {
    return this.deleteMany(criteria).limit(1)
  }

  static deleteMany(criteria = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action(ACTIONS.DELETE)
    orm.model(this)
    orm.criteria(criteria)
    orm.collection(collection)
    // orm.options(options)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    orm.return(RETURN.DOC)
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
    orm.action(ACTIONS.DOCUMENT)
    return orm
  }

  static findOne(criteria = {}) {
    return this.find(criteria).return(RETURN.DOC)
  }

  static find(criteria = {}) {
    return this.findMany(criteria)
  }

  static findMany(criteria = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action(ACTIONS.FIND)
    orm.model(this)
    orm.criteria(criteria)
    orm.collection(collection)
    // orm.options(options)
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
    orm.action(ACTIONS.FIND)
    orm.model(this)
    orm.query(query)
    orm.collection(collection)
    // orm.options(options)
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

    let criteria = {
      collection: EdgeModel.collectionName,
      id: boundCollection + AQL.DIVIDER + id, //this.documentId(id),
      inbound
    }

    let orm = new ORM()
    orm.action(ACTIONS.FIND_EDGE)
    orm.criteria(criteria)
    orm.model(this)
    orm.options(options)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    orm.return()

    return orm
  }

  static count(criteria = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action(ACTIONS.COUNT)
    orm.model(this)
    orm.criteria(criteria)
    orm.collection(collection)
    // orm.options(options)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    orm.return(RETURN.DOC)
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
    this.emit(HOOKS.LINK, {
      model: this,
      data: { from, to }
    })

    return new Promise(async (resolve, reject) => {
      if (!this.schema.isEdge) {
        return reject(new Error(ERRORS.EDGE_MODEL_REQUIRED))
      }
      let item = new this(from, to)
      await item.save()
      let result = resolve(item)

      this.emit(HOOKS.LINKED, {
        model: this,
        data: { from, to }
      })

      return result
    })
  }

  static unlink(from, to) {
    let unlinkResult

    this.emit(HOOKS.UNLINK, {
      model: this,
      data: { from, to }
    })

    return new Promise(async (resolve, reject) => {
      if (!this.schema.isEdge) {
        return reject(new Error(ERRORS.EDGE_MODEL_REQUIRED))
      }

      if (from && to) {
        let result = await this.deleteOne({
          _from: this.orango.model(this.schema.from).collectionName + AQL.DIVIDER + from,
          _to: this.orango.model(this.schema.to).collectionName + AQL.DIVIDER + to
        })

        unlinkResult = resolve(result)

        this.emit(HOOKS.UNLINKED, {
          model: this,
          data: { from, to }
        })

        return unlinkResult
      }

      if (from) {
        let result = await this.deleteMany({
          _from: this.orango.model(this.schema.from).collectionName + AQL.DIVIDER + from
        })
        unlinkResult = resolve(result)

        this.emit(HOOKS.UNLINKED, {
          model: this,
          data: { from, to }
        })

        return unlinkResult
      }

      if (to) {
        let result = await this.deleteMany({
          _to: this.orango.model(this.schema.to).collectionName + AQL.DIVIDER + to
        })

        unlinkResult = resolve(result)

        this.emit(HOOKS.UNLINKED, {
          model: this,
          data: { from, to }
        })

        return unlinkResult
      }
    })
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
