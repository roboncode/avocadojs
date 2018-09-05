const { Model } = require('tangjs')
const ORM = require('./ORM')
const Schema = require('./Schema')
const mergeDefaultTree = require('./helpers/mergeDefaultTree')
const CONSTS = require('./consts')

require('colors')

class OrangoModel extends Model {
  static setConnection(connection) {
    this.connection = connection
    return this
  }

  static _return(orm, options) {
    switch (options.returnType) {
      case 'orm':
        return orm
      case 'aql':
        return orm.toAQL(options)
      default:
        return orm.exec()
    }
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
    return this._return(orm, options)
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
    orm.connection(this.connection)
    orm.schemaOptions(this.schema.options)
    return this._return(orm, options)
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
    orm.connection(this.connection)
    orm.schemaOptions(this.schema.options)
    return this._return(orm, options)
  }

  static getCollection() {
    let db = this.connection.db
    if (this.schema.options.edge) {
      return db.edgeCollection(this.collectionName)
    }
    return db.collection(this.collectionName)
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

  static findByEdge(edgeCollection, id, options = {}) {
    let collection = this.getCollection()

    let inbound = collection.name === edgeCollection.schema.from

    let boundCollection = inbound
      ? edgeCollection.schema.to
      : edgeCollection.schema.from

    let criteria = {
      collection: edgeCollection.collectionName,
      id: boundCollection + '/' + id,
      inbound
    }

    let orm = new ORM()
    orm.action('findEdge')
    orm.criteria(criteria)
    orm.model(this)
    orm.options(options)
    orm.connection(this.connection)
    orm.schemaOptions(this.schema.options)

    return this._return(orm, options)
  }

  static removeFromEdge(from, to) {
    if (typeof from === 'object') {
      if (from && to) {
        from = from._key
        to = to._key
      } else if (this.schema.from === from.collection.name) {
        from = from._key
      } else if (this.schema.to === from.collection.name) {
        to = from._key
        from = null
      }
    }

    if (from && to) {
      return this.deleteOne({
        _from: this.schema.from + '/' + from,
        _to: this.schema.to + '/' + to
      })
    }
    if (from) {
      return this.deleteMany(
        {
          _from: this.schema.from + '/' + from
        },
        {
          returnSingle: true
        }
      )
    }
    if (to) {
      return this.deleteMany(
        {
          _to: this.schema.to + '/' + to
        },
        {
          returnSingle: true
        }
      )
    }
  }

  static findMany(criteria = {}, options = {}, returnOrm = false) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action('find')
    orm.model(this)
    orm.criteria(criteria)
    orm.collection(collection)
    orm.options(options)
    orm.connection(this.connection)
    orm.schemaOptions(this.schema.options)
    return this._return(orm, options)
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
    return this._return(orm, options)
  }

  static count(criteria = {}, options = {}) {
    let collection = this.getCollection()
    let orm = new ORM()
    orm.action('count')
    orm.model(this)
    orm.criteria(criteria)
    orm.collection(collection)
    orm.options(options)
    orm.connection(this.connection)
    orm.schemaOptions(this.schema.options)
    return this._return(orm, options)
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
      let result = await collection.import(docs)
      return resolve(result)
    })
  }

  constructor(data = {}, schema = {}, options = {}) {
    if (!(schema instanceof Schema)) {
      schema = new Schema(schema)
    }
    mergeDefaultTree(data, schema._defaultData)
    super(data, schema, options)
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

  async toAQL(options = {}) {
    options.returnType = 'aql'
    return this.save(options)
  }

  async save(options = {}) {
    if (options.saveAsNew) {
      this._removeKeys()
    }

    let result

    if (this.isNew && !options.update) {
      result = await this.constructor.insert(this, options)
      if (!options.returnType) {
        Object.assign(this, result)
        this.emit('created', this)
      }
    } else {
      if (!this._key) {
        throw new Error('Missing required _key')
      }
      result = this.constructor.updateOne({ _key: this._key }, this, options)
      this.emit('updated', this)
    }

    return result
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

  removeFromEdge(EdgeModel, id) {
    if (EdgeModel.schema.from === this.collection.name) {
      return EdgeModel.removeFromEdge(this._key, id)
    } else if (EdgeModel.schema.to === this.collection.name) {
      return EdgeModel.removeFromEdge(id, this._key)
    }
  }
}

module.exports = OrangoModel
