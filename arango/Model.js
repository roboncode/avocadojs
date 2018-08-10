const AvocadoModel = require('../avocado/Model')
const Builder = require('../avocado/Builder')
const inc = require('./queries/inc')
const filterProps = require('../avocado/helpers/filterProps')
const criteriaBuilder = require('./helpers/criteriaBuilder')
const iterate = require('../avocado/helpers/iterate')
const EXPR = /"expr\([\s+]?([\w\s.+-]+)\)"/gi

require('colors')

function iterateHandler(target, prop, val, path) {
  switch (typeof target[prop]) {
    case 'object':
      if (!(val instanceof Array)) {
        if (val.$inc != undefined) {
          target[prop] = 'EXPR(' + path.join('.') + '+' + val.$inc + ')'
        } else {
          iterate(val, iterateHandler, path)
        }
      }
    case 'string':
      if (val.match(/\+{2}\d/gi)) {
        target[prop] = 'EXPR(' + path.join('.') + '+' + val.substr(2) + ')'
      }
  }
}
class ArangoModel extends AvocadoModel {

  static setConnection(connection) {
    this.connection = connection
    return this
  }

  static async updateById(id, data) {
    return this.update({
      _key: id
    }, data)
  }

  static async update(criteria, data) {
    return new Promise(async resolve => {
      const schemaOptions = this.schema.options
      const doc = await Builder.getInstance()
        .data(data)
        .convertTo(this)
        .intercept((data, index) => {
          iterate(data, iterateHandler)
          return data
        })
        .toObject({
          noDefaults: true,
          unknownProps: schemaOptions.strict ? 'strip' : 'allow'
        })
        .exec()

      const collectionName = this.collectionName
      const aqlSegments = []
      const DOC_VAR = 'doc'
      aqlSegments.push('FOR', DOC_VAR, 'IN', collectionName)
      aqlSegments.push('\n   FILTER', criteriaBuilder(criteria, DOC_VAR))
      aqlSegments.push('\n   UPDATE', DOC_VAR, '\n   WITH', JSON.stringify(doc))
      aqlSegments.push('\n   IN', collectionName)

      const query = aqlSegments.join(' ').replace(EXPR, DOC_VAR + ".$1")
      await this.connection.db.query(query)

      resolve()
    })
  }

  static async deleteById() {

  }

  static async delete() {

  }

  static getCollection() {
    let db = this.connection.db
    return db.collection(this.collectionName)
  }

  static find(conditions) {
    let collection = this.getCollection()
  }

  static findOne(conditions) {
    let collection = this.getCollection()
  }

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
      let collectionName = this.collectionName
      let schemaOptions = this.schema.options
      let result
      if (schemaOptions.strict) {
        let schemaKeys = this.schema.schemaKeys
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