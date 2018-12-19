const fs = require('fs')
const pluralize = require('pluralize')
require('colors')

let orango = {
  model(name, Model) {
    if (Model) {
      this.models[name] = Model
    }
    return this.models[name]
  },

  models: {}
}

class Model {
  static factory(name, schema) {
    class DocumentModel extends Model {
      static getSchema() {
        return schema
      }

      static getCollection() {
        // this.schema.getCollection()
        return {
          name: pluralize(name).toLowerCase()
        }
      }
    }

    Object.defineProperty(DocumentModel, 'name', {
      value: name
    })

    return DocumentModel
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

class QueryBuilder {
  constructor(query = {}) {
    this._query = query
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

  byId(id) {
    this.where({
      _key: id
    })
    this.one()
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

  let(key, value) {
    if (!this._query.lets) {
      this._query.lets = {}
    }
    this._query.lets[key] = value
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
    if (!this._query.queries) {
      this._query.queries = []
    }
    if (typeof opts[0] === 'string') {
      this._query.queries.push({
        id: opts[0],
        query: opts[1].toJSON()
      })
    } else {
      this._query.queries.push({
        query: opts[0].toJSON()
      })
    }
    return this
  }

  return(value) {
    this._query.return = value || Model.return()
    return this
  }

  toJSON() {
    let returnOptions = this._query.return
    if (returnOptions && returnOptions.options) {
      returnOptions = returnOptions.options
    }
    const q = Object.assign({}, this._query, {
      return: returnOptions
    })

    return {
      v: 1,
      q
    }
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
let Identity = Model.factory('Identity')
let User = Model.factory('User')
let Like = Model.factory('Like', {
  from: 'User',
  to: 'Identity'
})
let UserQuery = User.update({
  firstName: 'John'
})
  .one()
  .where({
    _key: '@{^.user}'
  }) // .name('u')
  .return()

// MOCK, TODO: turn real
orango.model('Identity', Identity)
orango.model('User', User)
orango.model('Like', Like)

// var u = new User()
// u.firstName = 'Rob'
// u.lastName = 'Taylor'

// console.log(u.toJSON())

function formatJSON(data, indent = false) {
  return JSON.stringify(data, null, indent ? 2 : 0)
}

function test1() {
  let result = Identity.update({
    verified: true,
    bogus: true
  })
    .one()
    .where({
      _key: '217388'
    })
    .name('ident')
    .query('user', UserQuery)
    .select('name')
    .return(
      Model.return('ident')
        .append('user', 'myUser')
        .append('user', 'myUser2')
        .merge('user')
        .id()
        .computed()
    )

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test2() {
  let result = User.insert({
    firstName: 'John',
    lastName: 'Smith'
  })
    .query(
      'id1',
      Identity.update({
        provider: 'hello',
        verified: true
      }).where({
        _key: '123'
      })
    )
    .return()

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test3() {
  let result = User.remove()
    .one()
    .where({
      active: true
    })
    .return()

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test4() {
  let result = User.find()
    .one()
    .where({
      active: true
    })
    .return()

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test5() {
  let result = User.count()
    .where({
      active: true
    })
    .return()

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test6() {
  let result = User.upsert(
    {
      name: 'user',
      firstName: 'John'
    },
    {
      lastName: 'Smith'
    }
  )
    .one()
    .where({
      name: 'user'
    })
    .return()

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test7() {
  let result = User.find()
    .one()
    .let('num', 1)
    .let('str', 'Hello')
    .let('bool', true)
    .let('arr', [1, 'two', true])
    .let('obj', {
      foo: 'bar'
    })
    .return(
      Model.return()
        .append('num', 'num1')
        .append('bool')
        .merge('arr')
        .id()
        .computed()
    )

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test8() {
  let result = User.import([
    {
      firstName: 'Jane',
      lastName: 'Doe'
    },
    {
      firstName: 'Fred',
      lastName: 'Flintstone'
    }
  ])

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test9() {
  let result = Like.link('a', 'b', {
    more: 'data'
  })

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test10() {
  let result = Like.unlink(null, 'b')
  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test11() {
  let result = User.find().byId('12345')

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

// User.find().byId().and.update()
// User.update().byId().return()

test1()
// test2()
// test3()
// test4()
// test5()
// test6()
// test7()
// test8() // TODO: implement parser
// test9()
// test10()
// test11()
