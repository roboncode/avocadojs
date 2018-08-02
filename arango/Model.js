const AvocadoModel = require('../avocado/Model')
const Builder = require('../avocado/Builder')
const inc = require('./queries/inc')
const filterProps = require('../avocado/helpers/filterProps')

class ArangoModel extends AvocadoModel {

  static getCollectionName() {
    return this.options.name
  }

  static setConnection(connection) {
    this.connection = connection
    return this
  }

  static getCollection() {
    let db = this.connection.db
    let collectionName = this.getCollectionName()
    return db.collection(collectionName)
  }

  static find() {}

  static findOne() {}

  static findById(id) {
    return new Promise(async (resolve, reject) => {
      let doc = await this.getCollection().document(id)
      let schemaOptions = this.schema.options
      let result = await Builder.getInstance()
        .data(doc)
        .convertTo(this)
        .toObject({
          noDefaults: false,
          unknownProps: schemaOptions.strict ? 'strip' : 'allow'
        })
        .exec()
      return resolve(result)
    })
  }

  static inc(id, propOrProps, val = 1) {
    return new Promise(async (resolve, reject) => {
      let collectionName = this.getCollectionName()
      let schemaOptions = this.schema.options
      let result
      if (schemaOptions.strict) {
        let schemaKeys = this.schema.getSchemaKeys()
        let props = [].concat(propOrProps)
        let filteredProps = filterProps(schemaKeys, props)
        result = await inc(collectionName, id, filteredProps, val)
      } else {
        result = await inc(collectionName, id, propOrProps, val)
      }
      return resolve(result)
    })
  }

  static importDocs(docs, truncate = false) {
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

  async update() {
    if (!this.isNew) {

    }
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