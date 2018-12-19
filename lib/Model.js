const { Model } = require('tangjs')
const Schema = require('./Schema')
const mergeDefaultTree = require('./helpers/mergeDefaultTree')
const { AQL, ERRORS, HOOKS, METHODS, RETURN } = require('./consts')

require('colors')

class OrangoModel extends Model {
  static factory(name, schema) {
    class DocumentModel extends OrangoModel {
      static getSchema() {
        return schema
      }

      static getCollection() {
        return this.schema.getCollection()
      }
    }

    Object.defineProperty(DocumentModel, 'name', {
      value: name
    })

    return DocumentModel
  }

  constructor(data = {}, schema = {}) {
    if (!(schema instanceof Schema)) {
      schema = new Schema(schema)
    }
    mergeDefaultTree(data, schema._defaultData)
    super(data, schema)

    // let id = data.id || data._key
    // if (id) {
    //   delete data.id
    //   delete data._key
    //   this.id(id)
    // }
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
      let collection = this.getCollection()
      let result = await collection.truncate()
      return resolve(result)
    })
  }

  static getSchema() {
    throw new Error(`Abstract method "getSchema" not implemented`)
  }

  static getCollection() {
    throw new Error(`Abstract method "getCollection" not implemented`)
  }

  static getKey(id) {
    if (!id.match(/\//g)) {
      return this.getCollection().name + '/' + id
    }
    return id
  }

  static return(value) {
    return new Return({
      value
    })
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
    return this._qb('remove', data)
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
    from = orango.model(schema.from).getKey(from)
    to = orango.model(schema.to).getKey(to)

    return this._qb('link', {
      ...data,
      from,
      to
    })
  }

  static unlink(from, to) {
    const schema = this.getSchema()
    if (from) {
      from = orango.model(schema.from).getKey(from)
    } else {
      from = undefined
    }

    if (to) {
      to = orango.model(schema.to).getKey(to)
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
