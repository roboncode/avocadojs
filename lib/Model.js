const { Model } = require('tangjs')
const Schema = require('./Schema')
// const EdgeSchema = require('./EdgeSchema')
const QueryBuilder = require('./QueryBuilder')
const mergeDefaultTree = require('./helpers/mergeDefaultTree')
const pluralize = require('pluralize')
const convertToSnakecase = require('./helpers/convertToSnakecase')
const Return = require('./Return')

class OrangoModel extends Model {
  static factory(orango, name, schema, ...rest) {
    let collectionName,
      schemaOptions = {}
    if (rest.length) {
      if (typeof rest[0] === 'string') {
        collectionName = rest[0]
      } else {
        schemaOptions = rest[0]
      }

      if (rest.length > 1) {
        if (typeof rest[1] === 'string') {
          collectionName = rest[1]
        } else {
          schemaOptions = rest[1]
        }
      }
    }

    if (!(schema instanceof Schema)) {
      schema = new Schema(schema, schemaOptions)
      if (schemaOptions.edge) {
        schema.from = schemaOptions.from
        schema.to = schemaOptions.to
        schema.isEdge = true
      }
    }

    class DocumentModel extends OrangoModel {
      constructor(data) {
        super(data, schema)
      }
    }

    Object.defineProperty(DocumentModel, 'name', {
      value: name
    })

    DocumentModel.orango = orango
    DocumentModel.schema = schema
    DocumentModel.collectionName =
      collectionName || convertToSnakecase(pluralize(name))

    return DocumentModel
  }

  constructor(data = {}, schema = {}) {
    // TODO: Check if this is still needed with update
    mergeDefaultTree(data, schema._defaultData)

    super(data, schema)
  }

  static _qb(method, data) {
    let qb = new QueryBuilder({
      model: this.name,
      method,
      data
    })
    qb.orango = this.orango
    return qb
  }

  static truncate() {
    return new Promise(async resolve => {
      let collection = this.schema.collection
      let result = await collection.truncate()
      return resolve(result)
    })
  }

  static getKey(id) {
    if (!id.match(/\//g)) {
      return this.collectionName + '/' + id
    }
    return id
  }

  static find() {
    return this._qb('find').return()
  }

  static insert(data = {}) {
    return this._qb('insert', data)
  }

  static update(data = {}) {
    return this._qb('update', data)
  }

  static replace(data = {}) {
    return this._qb('replace', data)
  }

  static remove() {
    return this._qb('remove')
  }

  static count() {
    return this._qb('count').return()
  }

  static upsert(insertData = {}, updateData = {}) {
    return this._qb('upsert', {
      insert: insertData,
      update: updateData
    })
  }

  static link(from, to, data = {}) {
    const schema = this.schema
    from = this.orango
      .model(schema.from)
      .getKey(from)
    to = this.orango
      .model(schema.to)
      .getKey(to)

    return this._qb('link', {
      ...data,
      from,
      to
    })
  }

  static unlink(from, to) {
    const schema = this.schema
    if (from) {
      from = this.orango
        .model(schema.from)
        .getKey(from)
    } else {
      from = undefined
    }

    if (to) {
      to = this.orango
        .model(schema.to)
        .getKey(to)
    } else {
      to = undefined
    }

    return this._qb('unlink', {
      from,
      to
    })
  }

  static import(items) {
    return this._qb('import', {
      data: items
    })

    // TODO: Change to...
    // return this._qb('import', items)
  }

  static return(val) {
    let ret = val
    if (!(val instanceof Return)) {
      ret = new Return(this.name)
      ret.value(val)
    }
    return ret
  }

  toQuery() {
    if (this._key) {
      let d = JSON.parse(JSON.stringify(this))
      delete d._key
      return this.constructor
        .update(d)
        .where({ _key: this._key })
        .return()
    }
    return this.constructor.insert(this).return()
  }
}

module.exports = OrangoModel
