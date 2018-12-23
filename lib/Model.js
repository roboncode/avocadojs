const { Model } = require('tangjs')
const QueryBuilder = require('./QueryBuilder')
const mergeDefaultTree = require('./helpers/mergeDefaultTree')
const Return = require('./Return')

class OrangoModel extends Model {
  constructor(data = {}, schema = {}) {
    // TODO: Check if this is still needed with update
    mergeDefaultTree(data, schema._defaultData)

    super(null, schema)

    try {
      Object.assign(this, data)
    } catch (e) {
      // TODO: Make this async
      for (let prop in data) {
        try {
          this[prop] = data[prop]
        } catch (e) { }
      }
    }
  }

  fromJSON(data, struct) {
    let classRef
    for (let prop in struct) {
      if (data.hasOwnProperty(prop)) {
        if (struct[prop] instanceof Array) {
          classRef = struct[prop][0]
        } else {
          classRef = struct[prop]
        }
        if (typeof classRef === 'string') {
          classRef = this.constructor.orango.model(classRef)
        }
        data[prop] = classRef.fromJSON(data[prop])
      }
    }

    Object.assign(this, data)
    return this
  }

  static fromJSON(data) {
    if (data) {
      let inst
      if (data instanceof Array) {
        let arr = []
        for (let i = 0; i < data.length; i++) {
          inst = new this()
          arr[i] = inst.fromJSON(data[i], this.struct)
        }
        return arr
      }
      inst = new this()
      inst.fromJSON(data, this.struct)
      return inst
    }
  }

  static _qb(method, data) {
    let qb = new QueryBuilder(
      {
        model: this.name,
        method,
        data
      },
      this.execQuery
    )

    qb.toAQL = async (formatted = false) => {
      if (!this.orango) {
        throw new Error('Orango instance required')
      }
      return await this.orango.queryToAQL(qb, formatted)
    }

    qb.execQuery = async aql => {
      let orango = this.orango
      let cursor = await orango.connection.db.query(aql)
      let data
      if (qb.getQuery().return.one) {
        data = await cursor.next()
      } else {
        data = await cursor.all()
      }
      return data
    }

    qb.then = async (resolve, reject) => {
      this.emit(`hook:${method}`, { query: qb.q })
      let aql = await qb.toAQL()
      try {
        let data = await qb.execQuery(aql)
        resolve(data)
        this.emit(`hook:${method}ed`, { data })
      } catch (e) {
        reject(e)
      }
    }
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
    from = this.orango.model(schema.from).getKey(from)
    to = this.orango.model(schema.to).getKey(to)

    Object.assign(data, { to, from })

    return this._qb('link', data)
  }

  static unlink(from, to) {
    const schema = this.schema
    if (from) {
      from = this.orango.model(schema.from).getKey(from)
    } else {
      from = undefined
    }

    if (to) {
      to = this.orango.model(schema.to).getKey(to)
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

  async save() {
    let c = this.constructor

    let result = await (this._key
      ? c.update(this).where({ _key: this._key })
      : c.insert(this)
    ).return(new Return().one())
    if (result) {
      Object.assign(this, result)
    }
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
