const AvocadoModel = require('../tang/Model')
const ORM = require('./ORM')
const Schema = require('./Schema')
const mergeDefaultTree = require('./helpers/mergeDefaultTree')

require('colors')

class ArangoModel extends AvocadoModel {
  static setConnection(connection) {
    this.connection = connection
    return this
  }

  static insert(model, options = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action('insert')
    orm.model(this)
    orm.data(model)
    orm.collection(collection)
    orm.options(options)
    orm.connection(this.connection)
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
    if (db) {
      if (this.schema.options.edge) {
        return db.edgeCollection(this.collectionName)
      }
      return db.collection(this.collectionName)
    }
    return {
      name: this.collectionName,
      save() {
        return Promise((resolve, reject) => {
          return reject('No connection to database')
        })
      }
    }
  }

  static findById(id, options = {}) {
    if (!id) {
      throw new Error('Id is required')
    }
    return this.findOne(
      {
        _key: id.split('/').pop()
      },
      options
    )
  }

  static findOne(criteria = {}, options = {}) {
    options.limit = 1
    options.returnSingle = true
    return this.find(criteria, options)
  }

  static find(criteria = {}, options = {}) {
    return this.findMany(criteria, options)
  }

  static findByEdge(criteria, options = {}) {
    let orm = new ORM()
    orm.action('findEdge')
    orm.criteria(criteria)
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

  constructor(data = {}, schema = {}, options = {}) {
    if (!(schema instanceof Schema)) {
      schema = new Schema(schema)
    }
    mergeDefaultTree(data, schema._defaultData)
    super(data, schema, options)
  }

  get isNew() {
    return !this._id
  }

  async toAQL(options = {}) {
    this._returnAQL = true
    return this.save(options)
  }

  async save(options = {}) {
    if (options.saveAsNew) {
      delete this._id
      delete this._key
      delete this._rev
    }

    let result

    if (this.isNew && !options.update) {
      let orm = this.constructor.insert(this)
      if (this._returnAQL) {
        delete this._returnAQL
        result = await orm.toAQL(options)
      } else {
        result = await orm.exec()
        this.emit('created', result)
      }
    } else {
      if (!this._key) {
        throw new Error('Missing required _key')
      }
      let orm = this.constructor.updateOne({ _key: this._key }, this, options)
      if (this._returnAQL) {
        delete this._returnAQL
        result = await orm.toAQL(options)
      } else {
        result = await orm.exec()
        this.emit('updated', result)
      }
    }

    return result
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
