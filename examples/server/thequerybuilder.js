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

  find(filter = {}) {
    let qb = new QueryBuilder({
      method: 'find',
      model: this.name,
      filter
    })
    qb.return()
    return qb
  }

  insert(data = {}) {
    let qb = new QueryBuilder({
      method: 'insert',
      model: this.name,
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

  replace(filter, data = {}) {
    let qb = new QueryBuilder({
      method: 'replace',
      model: this.name,
      filter,
      data
    })
    return qb
  }

  remove(filter = {}) {
    let qb = new QueryBuilder({
      method: 'remove',
      model: this.name,
      filter
    })
    return qb
  }

  count(filter = {}) {
    let qb = new QueryBuilder({
      method: 'count',
      model: this.name,
      filter
    })
    qb.return()
    return qb
  }

  upsert(filter = {}, insertData = {}, updateData = {}) {
    let qb = new QueryBuilder({
      method: 'upsert',
      model: this.name,
      filter,
      data: {
        insert: insertData,
        update: updateData
      }
    })
    qb.return()
    return qb
  }

  return() {
    return new Return()
  }
}

class QueryBuilder {
  constructor(query = {}) {
    this._query = query
    this._query.queries = []
  }

  _ensureReturn() {
    if (!this._query.return) {
      this._query.return = {}
    }
  }

  name(val) {
    this._query.name = val
    return this
  }

  filter(val) {
    this._query.filter = val
    return this
  }

  offset(val = 0) {
    this._query.offset = val
    return this
  }

  limit(val = 10) {
    this._query.limit = val
    return this
  }

  one() {
    this._query.one = true
    return this
  }

  select(val = '') {
    if (val) {
      this._query.select = val
    } else {
      delete this._query.select
    }
    return this
  }

  query(...opts) {
    if (typeof opts[0] === 'string') {
      this._query.queries.push({
        id: opts[0],
        query: opts[1].rawQuery()
      })
    } else {
      this._query.queries.push({
        query: opts[0].rawQuery()
      })
    }
    return this
  }

  return(value) {
    this._query.return = value || Model.return()
    return this
  }

  rawQuery() {
    let returnOptions = this._query.return
    if (returnOptions && returnOptions.options) {
      returnOptions = returnOptions.options
    }
    return Object.assign({}, this._query, { return: returnOptions })
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
let UserQuery = User.update({ _key: '@{^.user}' }).one().name('u').return()

function test1() {
  let result = Identity.update({ _key: '217388' }, { verified: true, bogus: true })
    .name('ident')
    .one()
    .query('user', UserQuery)
    .select('name')
    .return(Model.return('ident').append('user', 'myUser').append('user', 'myUser2').merge('user').id().computed())

  console.log(result.toString().green)

  fs.writeFileSync('query.json', result.toString(true), 'utf-8')
}

function test2() {
  let result = User.insert({ firstName: 'John', lastName: 'Smith' })
    .query('id1', Identity.update({ _key: '123' }, { provider: 'hello', verified: true }))
    .return()
  console.log(result.toString().green)
  fs.writeFileSync('query.json', result.toString(true), 'utf-8')
}

// test1()
test2()
