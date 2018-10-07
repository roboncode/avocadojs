const { Model } = require('tangjs')
const ORM = require('./ORM')
const Schema = require('./Schema')
const mergeDefaultTree = require('./helpers/mergeDefaultTree')
const CONSTS = require('./consts')

require('colors')

class OrangoModel extends Model {
  static documentId(key) {
    return this.collectionName + '/' + key
  }

  static insert(model, options = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action('insert')
    orm.model(this)
    orm.data(model)
    orm.collection(collection)
    orm.options(options)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static findByIdAndUpdate(id, data, options = {}) {
    if (!id) {
      throw new Error('Id is required')
    }
    return this.updateOne(
      {
        _key: id.split('/').pop()
      },
      data,
      options
    )
  }

  static updateOne(criteria = {}, data, options = {}) {
    options.limit = 1
    options.returnSingle = true
    return this.updateMany(criteria, data, options)
  }

  static updateMany(criteria = {}, data, options = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action('update')
    orm.model(this)
    orm.criteria(criteria)
    orm.data(data)
    orm.collection(collection)
    orm.options(options)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static findByIdAndDelete(id, options = {}) {
    if (!id) {
      throw new Error('Id is required')
    }
    return this.deleteOne(
      {
        _key: id.split('/').pop()
      },
      options
    )
  }

  static deleteOne(criteria = {}, options = {}) {
    options.limit = 1
    options.returnSingle = true
    return this.deleteMany(criteria, options)
  }

  static deleteMany(criteria = {}, options = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action('delete')
    orm.model(this)
    orm.criteria(criteria)
    orm.collection(collection)
    orm.options(options)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static getCollection() {
    if (!this.orango.connection.connected) {
      throw new Error(CONSTS.ERRORS.NOT_CONNECTED)
    }

    let db = this.orango.connection.db
    if (this.schema.options.edge) {
      return db.edgeCollection(this.collectionName)
    }
    return db.collection(this.collectionName)
  }

  static findById(id, options = {}) {
    if (!id) {
      throw new Error('Id is required')
    }

    let orm = this.findOne(
      {
        _key: id.split('/').pop()
      },
      options
    )
    orm.action('document')
    return orm
  }

  static findOne(criteria = {}, options = {}) {
    options.limit = 1
    options.returnSingle = true
    return this.find(criteria, options)
  }

  static find(criteria = {}, options = {}) {
    return this.findMany(criteria, options)
  }

  static findMany(criteria = {}, options = {}, returnOrm = false) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action('find')
    orm.model(this)
    orm.criteria(criteria)
    orm.collection(collection)
    orm.options(options)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static findByQuery(query, options = {}) {
    // replace @@Model with the collection name of the model
    query = query.replace(/@@([A-Z]\w+)/g, (match, p1) => {
      return this.orango.model(p1).collectionName
    })

    let collection = this.getCollection()
    let orm = new ORM()
    orm.action('find')
    orm.model(this)
    orm.query(query)
    orm.collection(collection)
    orm.options(options)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static findByEdge(EdgeModel, id, options = {}) {
    let inbound =
      this.collectionName ===
      this.orango.model(EdgeModel.schema.from).collectionName

    inbound = options.hasOwnProperty('outbound')
      ? options.outbound === false
      : inbound

    let boundCollection = inbound
      ? this.orango.model(EdgeModel.schema.to).collectionName
      : this.orango.model(EdgeModel.schema.from).collectionName

    let criteria = {
      collection: EdgeModel.collectionName,
      id: boundCollection + '/' + id, //this.documentId(id),
      inbound
    }

    let orm = new ORM()
    orm.action('findEdge')
    orm.criteria(criteria)
    orm.model(this)
    orm.options(options)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)

    return orm
  }

  static count(criteria = {}, options = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action('count')
    orm.model(this)
    orm.criteria(criteria)
    orm.collection(collection)
    orm.options(options)
    orm.connection(this.orango.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static truncate() {
    return new Promise(async resolve => {
      let collection = this.getCollection()
      let result = await collection.truncate()
      return resolve(result)
    })
  }

  static importMany(docs, truncate = false) {
    return new Promise(async resolve => {
      let collection = this.getCollection()
      if (truncate) {
        await collection.truncate()
      }
      let results = await collection.import(docs)
      return resolve(results)
    })
  }

  /**
   * @param {String} from
   * @param {String} to
   */
  static link(from, to) {
    return new Promise(async (resolve, reject) => {
      if (!this.schema.isEdge) {
        return reject(new Error(CONSTS.ERRORS.EDGE_MODEL_REQUIRED))
      }
      let item = new this(from, to)
      await item.save()
      return resolve(item)
    })
  }

  static unlink(from, to) {
    return new Promise(async (resolve, reject) => {
      if (!this.schema.isEdge) {
        return reject(new Error(CONSTS.ERRORS.EDGE_MODEL_REQUIRED))
      }

      if (from && to) {
        let result = await this.deleteOne({
          _from:
            this.orango.model(this.schema.from).collectionName + '/' + from,
          _to: this.orango.model(this.schema.to).collectionName + '/' + to
        })

        return resolve(result)
      }

      if (from) {
        let result = await this.deleteMany(
          {
            _from:
              this.orango.model(this.schema.from).collectionName + '/' + from
          },
          {
            returnSingle: true
          }
        )
        return resolve(result)
      }

      if (to) {
        let result = await this.deleteMany(
          {
            _to: this.orango.model(this.schema.to).collectionName + '/' + to
          },
          {
            returnSingle: true
          }
        )
        return resolve(result)
      }
    })
  }

  constructor(data = {}, schema = {}, options = {}) {
    if (!(schema instanceof Schema)) {
      schema = new Schema(schema)
    }
    mergeDefaultTree(data, schema._defaultData)
    super(data, schema, options)

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
      this._id = this.constructor.collectionName + '/' + val
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
