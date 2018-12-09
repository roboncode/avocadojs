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

  append(prop, qb) {
    qb.query.appendAs = prop
    this._ensureMethods()
    this.query.methods.push(qb.query)
    qb.return()
    return this
  }

  merge(prop, qb) {
    qb.query.appendAs = prop
    qb.query.merge = true
    this._ensureMethods()
    this.query.methods.push(qb.query)
    return this
  }

  return(options = {}) {
    this.query.return = options
    return this
  }

  call(qb) {
    this._ensureMethods()
    this.query.methods.push(qb.query)
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
  }

  as(val) {
    this.options.as = val
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
}

// let Tweet = new Model('Tweet')
let Identity = new Model('Identity')
let User = new Model('User')

// let result1 = Identity.find({ active: true }, { verified: true, bogus: true})
// .alias('id')
// .limit(10)
// .offset(1)
// .select('text')
// .append('user', User.find({ _key: '@{id.user}'}).id().computed().alias('george'))
// .merge(User.findOne({ _key: '@{id.user}'}).alias('fred'))
// .call(User.deleteOne({ _key: '@{id.user}'}))
// .call(User.updateOne({ _key: '@{id.user}' }))
// .call(User.updateOne({ _key: '@{id.user}' }))
// .return('NEW')

let UserQuery = User.update({ _key: '@{^.user}' }).one().alias('u').return()

let result = Identity.update({ _key: '217388' }, { verified: true, bogus: true })
  .alias('ident')
  .one()
  .append('user', UserQuery)
  .select('name')
  .return(Identity.return().as('NEW').id().computed())
  // .return({
  //   // as: 'NEW',
  //   id: true,
  //   computed: true
  // })

console.log(result.toString().green)

fs.writeFileSync('query.json', result.toString(true), 'utf-8')
