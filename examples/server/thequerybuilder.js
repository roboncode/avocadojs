const fs = require('fs')
require('colors')

class Model {
  constructor(name) {
    this.name = name
  }

  static return(value) {
    return new Return({
      value
    })
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

  update(filter, data = {}) {
    let qb = new QueryBuilder({
      method: 'update',
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

  return() {
    return new Return()
  }
}

class QueryBuilder {
  constructor(query = {}) {
    this.query = query
    this.query.subqueries = []
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

  one() {
    this.query.one = true
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

  // query(prop, qb) {
  //   // qb.rawQuery().appendAs = prop
  //   this._ensureMethods()
  //   this.query.methods.push(qb.query)
  //   qb.return()
  //   return this
  // }

  subquery(...opts) {
    if (typeof opts[0] === 'string') {
      this.query.subqueries.push({
        id: opts[0],
        query: opts[1].rawQuery()
      })
    } else {
      this.query.subqueries.push({
        query: opts[0].rawQuery()
      })
    }
    return this
  }

  return(value) {
    this.query.return = value || Model.return()
    return this
  }

  rawQuery() {
    let returnOptions = this.query.return
    if (returnOptions && returnOptions.options) {
      returnOptions = returnOptions.options
    }
    return Object.assign({}, this.query, { return: returnOptions })
  }

  toString(indent = false) {
    return JSON.stringify(this.rawQuery(), null, indent ? 2 : 0)
  }
}

class Return {
  constructor(options = {}) {
    this.options = options
    this.options.actions = this.options.actions || []
  }

  value(val) {
    this.options.value = val
    return this
  }

  id(val = true) {
    this.options.id = val
    return this
  }

  computed(val = true) {
    this.options.computed = val
    return this
  }

  model(val = true) {
    this.options.model = val
    return this
  }

  append(target, as) {
    this.options.actions.push({
      action: 'append',
      target,
      as
    })
    return this
  }

  merge(target) {
    this.options.actions.push({
      action: 'merge',
      target
    })
    return this
  }
}

// let Tweet = new Model('Tweet')
let Identity = new Model('Identity')
let User = new Model('User')
let UserQuery = User.update({ _key: '@{^.user}' }).one().alias('u').return()

let result = Identity.update({ _key: '217388' }, { verified: true, bogus: true })
  .alias('ident')
  .one()
  .subquery('user', UserQuery)
  .select('name')
  .return( 
    Model
    .return('ident')
    .append('user', 'myUser')
    .append('user', 'myUser2')
    .merge('user')
    .id()
    .computed()
  )

console.log(result.toString().green)

fs.writeFileSync('query.json', result.toString(true), 'utf-8')
