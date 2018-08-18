const AvocadoModel = require('../avocado/Model')
const Builder = require('../avocado/Builder')
const ORM = require('./ORM')

require('colors')

class ArangoModel extends AvocadoModel {
  static setConnection(connection) {
    this.connection = connection
    return this
  }

  static findByIdAndUpdate(id, data, options = {}) {
    return this.updateOne(
      {
        _key: id
      },
      data,
      options
    )
  }

  static updateOne(criteria = {}, data, options = {}) {
    options.limit = 1
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
    orm.connection(this.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static findByIdAndDelete(id, options = {}) {
    return this.deleteOne(
      {
        _key: id
      },
      options
    )
  }

  static deleteOne(criteria = {}, options = {}) {
    options.limit = 1
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
    orm.connection(this.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static getCollection() {
    let db = this.connection.db
    if (this.schema.options.edge) {
      return db.edgeCollection(this.collectionName)
    }
    return db.collection(this.collectionName)
  }

  static findById(id, options = {}) {
    return this.findOne(
      {
        _key: id
      },
      options
    )
  }

  static findOne(criteria = {}, options = {}) {
    options.limit = 1
    return this.find(criteria, options)
  }

  static find(criteria = {}, options = {}) {
    return this.findMany(criteria, options)
  }

  static findByEdgeId(id, edgeCollectionName, options = {}) {
    let orm = new ORM()
    orm.action('findEdge', { edgeCollectionName, id })
    orm.model(this)
    orm.options(options)
    orm.connection(this.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static findMany(criteria = {}, options = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action('find')
    orm.model(this)
    orm.criteria(criteria)
    orm.collection(collection)
    orm.options(options)
    orm.connection(this.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static findByQuery(query, options = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action('find')
    orm.model(this)
    orm.query(query)
    orm.collection(collection)
    orm.options(options)
    orm.connection(this.connection)
    orm.schemaOptions(this.schema.options)
    return orm
  }

  static importMany(docs, truncate = false) {
    return new Promise(async (resolve, reject) => {
      try {
        let collection = this.getCollection()

        if (truncate) {
          await collection.truncate()
        }
        let result = await collection.import(docs)
        return resolve(result)
      } catch (e) {
        return reject(e)
      }
    })
  }

  constructor(data, schema, options) {
    super(data, schema, options)
  }

  get isNew() {
    return !this._key
  }

  async save(options = {}) {
    if (options.saveAsNew) {
      delete this._key
    }
    const isNew = this.isNew
    const collection = this.constructor.getCollection()
    this.createdAt = Date.now()
    let data = await this.validate({
      noDefaults: true
    })

    let doc = await collection.save(data, {
      returnNew: false
    })
    Object.assign(this, doc)
    if (isNew) {
      this.emit('created', this)
    } else {
      this.emit('updated', this)
    }
    return this
  }

  async remove() {
    if (!this.isNew) {
      const collection = this.constructor.getCollection()
      let result = await collection.remove(this._key)
      this.emit('removed', this)
      return result
    }
  }
}

module.exports = ArangoModel
