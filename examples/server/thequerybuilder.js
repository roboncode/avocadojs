const fs = require('fs')
require('colors')

class Model {
  constructor(name) {
    this.name = name
  }

  findOne(filter = {}) {
    let qb = new QueryBuilder({
      method: 'findOne',
      model: this.name,
      filter
    })
    return qb
  }

  deleteOne(filter = {}) {
    let qb = new QueryBuilder({
      method: 'deleteOne',
      model: this.name,
      filter
    })
    return qb
  }

  updateOne(filter = {}, data = {}) {
    let qb = new QueryBuilder({
      method: 'updateOne',
      model: this.name,
      filter,
      data
    })
    return qb
  }

  find(filter = {}) {
    let qb = new QueryBuilder({
      method: 'find',
      model: this.name,
      filter
    })
    return qb
  }
}

class QueryBuilder {
  constructor(query = {}) {
    this.query = query
  }

  _ensureMethods() {
    if (!this.query.methods) {
      this.query.methods = []
    }
  }

  _ensureReturn() {
    if (!this.query.return) {
      this.query.return = {}
    }
  }

  alias(val) {
    this.query.alias = val
    return this
  }

  filter(val) {
    this.query.filter = val
    return this
  }

  offset(val = 0) {
    this.query.offset = val
    return this
  }

  limit(val = 10) {
    this.query.limit = val
    return this
  }

  select(val = '') {
    if (val) {
      this.query.select = val
    } else {
      delete this.query.select
    }
    return this
  }

  append(prop, qb) {
    qb.query.appendAs = prop
    this._ensureMethods()
    this.query.methods.push(qb.query)
    return this
  }

  merge(qb) {
    qb.query.merge = true
    this._ensureMethods()
    this.query.methods.push(qb.query)
    return this
  }

  call(qb) {
    this._ensureMethods()
    this.query.methods.push(qb.query)
    return this
  }

  id(val = true) {
    this._ensureReturn()
    this.query.return.id = val
    return this
  }

  computed(val = true) {
    this._ensureReturn()
    this.query.return.computed = val
    return this
  }

  return(val) {
    this._ensureReturn()
    this.query.return.value = val
    return this
  }

  toString(indent = 0) {
    return JSON.stringify(this.query, null, indent)
  }
}

// let Tweet = new Model('Tweet')
let Identity = new Model('Identity')
let User = new Model('User')

let result = Identity.find({ active: true }, { verified: true, bogus: true})
  // .alias('id')
  // .limit(10)
  // .offset(1)
  // .select('text')
  // .append('user', User.find({ _key: '@{id.user}'}).id().computed().alias('george'))
  // .merge(User.findOne({ _key: '@{id.user}'}).alias('fred'))
  // .call(User.deleteOne({ _key: '@{id.user}'}))
  // .call(User.updateOne({ _key: '@{id.user}' }))
  .call(User.updateOne({ _key: '@{id.user}' }))
  .return('NEW')

console.log(result.toString().green)

fs.writeFileSync('query.json', result.toString(4), 'utf-8')
