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

      static getSchema() {
        return schema
      }

      static getCollectionName() {
        if (!this._collectionName) {
          this._collectionName =
            collectionName || convertToSnakecase(pluralize(name))
        }
        return this._collectionName
      }

      static getOrango() {
        return orango
      }
    }

    Object.defineProperty(DocumentModel, 'name', {
      value: name
    })

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
    return new QueryBuilder({
      method,
      model: this.name,
      data
    })
  }

  static truncate() {
    return new Promise(async resolve => {
      let collection = this.getSchema().collection
      let result = await collection.truncate()
      return resolve(result)
    })
  }

  static getSchema() {
    throw new Error(`Abstract method "getSchema" not implemented`)
  }

  static getCollectionName() {
    throw new Error(`Abstract method "getCollectionName" not implemented`)
  }

  static getOrango() {
    throw new Error(`Abstract method "getOrango" not implemented`)
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
    const schema = this.getSchema()
    from = this.getOrango()
      .model(schema.from)
      .getKey(from)
    to = this.getOrango()
      .model(schema.to)
      .getKey(to)

    return this._qb('link', {
      ...data,
      from,
      to
    })
  }

  static unlink(from, to) {
    const schema = this.getSchema()
    if (from) {
      from = this.getOrango()
        .model(schema.from)
        .getKey(from)
    } else {
      from = undefined
    }

    if (to) {
      to = this.getOrango()
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
    if(!(val instanceof Return)) {
      ret = new Return()
      ret.value(val)
    }
    return ret
  }

  // TODO: ??? do we still need this?
  _parseId() {
    // let id = data.id || data._key
    // if (id) {
    //   delete data.id
    //   delete data._key
    //   this.id(id)
    // }
  }

  toJSON() {
    let json = {}
    let keys = Object.keys(this)
    let key
    for (let i = 0; i < keys.length; i++) {
      key = keys[i]
      json[key] = this[key]
    }
    return json
  }
}

module.exports = OrangoModel
