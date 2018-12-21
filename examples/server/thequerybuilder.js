const fs = require('fs')
const orango = require('../../lib')
require('colors')

let User = orango.model('User', {})
let Identity = orango.model('Identity', {})
let Like = orango.model('Like', {
  _from: String,
  _to: String
}, {
  from: 'User',
  to: 'Identity',
  strict: true,
  edge: true
})
let UserQuery = User.update({
  firstName: 'John'
})
  .one()
  .where({
    _key: '@{^.user}'
  })
  // .name('u')
  .return()

// MOCK, TODO: turn real
// orango.model('Identity', Identity)
// orango.model('User', User)
// orango.model('Like', Like)

// console.log('Whois', User)

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
    // .let('num', 1)
    // .let('str', 'Hello')
    // .let('bool', true)
    // .let('arr', [1, 'two', true])
    // .let('obj', {
    //   foo: 'bar'
    // })
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
    .one()
    .return()

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

// test1()
// test2()
// test3()
// test4()
// test5()
// test6()
// test7()
// test8()
test9() // FIXME: FAIL
// test10() // FIXME: FAIL
// test11()
