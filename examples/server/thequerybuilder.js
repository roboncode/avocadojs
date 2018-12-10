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

  find() {
    let qb = new QueryBuilder({
      method: 'find',
      model: this.name
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

  update(data = {}) {
    let qb = new QueryBuilder({
      method: 'update',
      model: this.name,
      data
    })
    return qb
  }

  replace(data = {}) {
    let qb = new QueryBuilder({
      method: 'replace',
      model: this.name,
      data
    })
    return qb
  }

  remove() {
    let qb = new QueryBuilder({
      method: 'remove',
      model: this.name
    })
    return qb
  }

  count() {
    let qb = new QueryBuilder({
      method: 'count',
      model: this.name
    })
    qb.return()
    return qb
  }

  upsert(insertData = {}, updateData = {}) {
    let qb = new QueryBuilder({
      method: 'upsert',
      model: this.name,
      data: {
        insert: insertData,
        update: updateData
      }
    })
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

  where(val) {
    this._query.where = val
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
let UserQuery = User.update({firstName: 'John'})
  .one()
  .where({ _key: '@{^.user}' })
  // .name('u')
  .return()

function test1() {
  let result = Identity.update({ verified: true, bogus: true })
    .one()
    .where({ _key: '217388' })
    .name('ident')
    .query('user', UserQuery)
    .select('name')
    .return(Model
      .return('ident')
      .append('user', 'myUser')
      .append('user', 'myUser2')
      .merge('user')
      .id()
      .computed())

  console.log(result.toString().green)

  fs.writeFileSync('query.json', result.toString(true), 'utf-8')
}

function test2() {
  let result = User.insert({ firstName: 'John', lastName: 'Smith' })
    .query('id1', Identity.update({ provider: 'hello', verified: true }).where({ _key: '123' }))
    .return()
  console.log(result.toString().green)
  fs.writeFileSync('query.json', result.toString(true), 'utf-8')
}

function test3() {
  let result = User.remove()
    .one()
    .where({active: true})
    .return()
    console.log(result.toString().green)
    fs.writeFileSync('query.json', result.toString(true), 'utf-8')
}

function test4() {
  let result = User.find()
    .one()
    .where({active: true})
    .return()
    console.log(result.toString().green)
    fs.writeFileSync('query.json', result.toString(true), 'utf-8')
}

function test5() {
  let result = User.count()
    .where({active: true})
    .return()
    console.log(result.toString().green)
    fs.writeFileSync('query.json', result.toString(true), 'utf-8')
}

function test6() {
  let result = User.upsert({name: 'user', firstName: 'John'}, {lastName: 'Smith'})
    .one()
    .where({name: 'user'})
    .return()
    console.log(result.toString().green)
    fs.writeFileSync('query.json', result.toString(true), 'utf-8')
}

// test1()
// test2()
// test3()
// test4()
// test5()
test6()