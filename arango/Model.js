const AvocadoModel = require('../avocado/Model')
const Builder = require('../avocado/Builder')
const asyncForEach = require('../avocado/helpers/asyncForEach')
const criteriaBuilder = require('./helpers/criteriaBuilder')
const EXPR = /"expr\([\s+]?([\w\s.+-]+)\)"/gi

require('colors')

async function iterateHandler(val, prop, target, path) {
  switch (typeof val) {
    case 'object':
      if (!(val instanceof Array)) {
        if (val.$inc != undefined) {
          target[prop] = 'EXPR(' + path.join('.') + val.$inc + ')'
        } else {
          await asyncForEach(val, iterateHandler, path)
        }
      }
      break
    case 'string':
      if (val.match(/[+-=]{2}\s?\d/gi)) {
        target[prop] = 'EXPR(' + path.join('.') + val[0] + val.substr(2) + ')'
      }
      break
  }
}
class ArangoModel extends AvocadoModel {

  static setConnection(connection) {
    this.connection = connection
    return this
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    return this.updateOne({
      _key: id
    }, data, options)
  }

  static async updateOne(criteria, data, options = {}) {
    options.limit = 1
    return this.updateMany(criteria, data, options)
  }

  static async updateMany(criteria, data, options = {}) {
    return new Promise(async (resolve, reject) => {
      const schemaOptions = this.schema.options
      const result = await Builder.getInstance()
        .data(data)
        .convertTo(this)
        .intercept(async (data) => {
          await asyncForEach(data, iterateHandler)
          return data
        })
        .toObject({
          noDefaults: true,
          unknownProps: schemaOptions.strict ? 'strip' : 'allow'
        })
        .exec()

      if (result instanceof Error) {
        return reject(result)
      }

      const collectionName = this.collectionName
      const aqlSegments = []
      const DOC_VAR = 'doc'
      const OFFSET = options.offset || 0
      const LIMIT = options.limit || null
      aqlSegments.push('FOR', DOC_VAR, 'IN', collectionName)
      aqlSegments.push('\n   FILTER', criteriaBuilder(criteria, DOC_VAR))
      if (OFFSET || LIMIT) {
        aqlSegments.push(`\n   LIMIT ${OFFSET},${LIMIT}`)
      }
      aqlSegments.push('\n   UPDATE', DOC_VAR, '\n   WITH', JSON.stringify(result))
      aqlSegments.push('\n   IN', collectionName)

      const query = aqlSegments.join(' ').replace(EXPR, DOC_VAR + ".$1")
      if (options.printAQL) {
        console.log(query)
      }
      await this.connection.db.query(query)

      return resolve()
    })
  }

  static async findByIdAndDelete(id, options = {}) {
    return this.deleteOne({
      _key: id
    }, options)
  }

  static async deleteOne(criteria, options = {}) {
    options.limit = 1
    return this.deleteMany(criteria, options)
  }

  static async deleteMany(criteria, options = {}) {
    return new Promise(async (resolve, reject) => {
      const collectionName = this.collectionName
      const aqlSegments = []
      const DOC_VAR = 'doc'
      const OFFSET = options.offset || 0
      const LIMIT = options.limit || null
      aqlSegments.push('FOR', DOC_VAR, 'IN', collectionName)
      aqlSegments.push('\n   FILTER', criteriaBuilder(criteria, DOC_VAR))
      if (OFFSET || LIMIT) {
        aqlSegments.push(`\n   LIMIT ${OFFSET},${LIMIT}`)
      }
      aqlSegments.push('\n   REMOVE', DOC_VAR)
      aqlSegments.push('\n   IN', collectionName)

      const query = aqlSegments.join(' ').replace(EXPR, DOC_VAR + ".$1")
      if (options.printAQL) {
        console.log(query)
      }
      await this.connection.db.query(query)

      return resolve()
    })
  }

  static getCollection() {
    let db = this.connection.db
    return db.collection(this.collectionName)
  }

  static findById(id, options = {}) {
    return this.findOne({
      _key: id
    }, options)
  }

  static findOne(criteria, options = {}) {
    options.limit = 1
    return this.find(criteria, options)
  }

  static find(criteria, options = {}) {
    return this.findMany(criteria, options)
  }

  static findMany(criteria, options = {}) {
    return new Promise(async (resolve, reject) => {
      const schemaOptions = this.schema.options
      const collectionName = this.collectionName
      const aqlSegments = []
      const DOC_VAR = 'doc'
      const OFFSET = options.offset || 0
      const LIMIT = options.limit || null
      aqlSegments.push('FOR', DOC_VAR, 'IN', collectionName)
      aqlSegments.push('\n   FILTER', criteriaBuilder(criteria, DOC_VAR))
      if (OFFSET || LIMIT) {
        aqlSegments.push(`\n   LIMIT ${OFFSET},${LIMIT}`)
      }
      aqlSegments.push('\n   RETURN', DOC_VAR)

      const query = aqlSegments.join(' ').replace(EXPR, DOC_VAR + ".$1")
      if (options.printAQL) {
        console.log(query)
      }
      let cursor = await this.connection.db.query(query)
      let docs = await cursor.all()
      let result = await Builder.getInstance()
        .data(docs)
        .convertTo(this)
        .toObject({
          noDefaults: false,
          unknownProps: schemaOptions.strict ? 'strip' : 'allow'
        })
        .exec()
      if (LIMIT === 1 && result) {
        return resolve(result[0])
      }
      return resolve(result)
    })
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