const fs = require('fs')
require('app-module-path').addPath(__dirname)
const readFiles = require('./helpers/readFiles')
const orango = require('orango')
require('colors')

let Identity, User, UserQuery

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
      Identity.return('ident')
        .append('user', 'myUser')
        .append('user', 'myUser2')
        .merge('user')
        .as('model')
    )

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test2() {
  let result = User.insert({
    firstName: 'John',
    lastName: 'Smith',
    bogus: true
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
      firstName: 'John',
      bogus: true
    },
    {
      lastName: 'Smith',
      bogus: true
    }
  )
    .one()
    .withDefaults()
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
      User.return()
        .append('num', 'num1')
        .append('bool')
        .merge('arr')
        .id()
        .computed()
    )

  // console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test8() {
  let result = User.import([
    {
      firstName: 'Jane',
      lastName: 'Doe',
      bogus: true
    },
    {
      firstName: 'Fred',
      lastName: 'Flintstone',
      bogus: true
    }
  ])
    .one()
    .return()

  console.log(formatJSON(result).green)
  fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
}

function test9() {
  let result = Like.link('a', 'b', { bogus: true, notes: 'This is a test' })

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

function test12() {
  let user = new User({ _key: '123', lastName: 'Doe' })
  user.firstName = 'Jane'
  let query = user.toQuery()
  console.log(formatJSON(query).green)
  fs.writeFileSync('query.json', formatJSON(query, true), 'utf-8')
}

async function test13() {
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
      Identity.return('ident')
        .append('user', 'myUser')
        .append('user', 'myUser2')
        .merge('user')
        .as('model')
    )

  console.log(formatJSON(result, false).green)
  // fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
  // let aql = await orango.queryToAQL(result, true)
  let aql = await result.toAQL(true)
  console.log(aql.cyan)
}

async function test14() {
  let o = orango.get('sample')
  let query = User.insert({
    firstName: 'Eddie',
    lastName: 'VanHalen',
    bogus: true
  }).return()
  console.log('connected'.magenta, o.connection.connected)
  console.log(formatJSON(query).green)
  let aql = await orango.queryToAQL(query, true)
  console.log(aql.cyan)
  let cursor = await o.connection.db.query(aql)
  let result
  if(query.one) {
    result = await cursor.next()
  } else {
    result = await cursor.all()
  }
  console.log(formatJSON(result).grey)
}

async function main() {
  readFiles(__dirname + '/models')

  await orango.get('sample').connect()

  Identity = orango.model('Identity')
  User = orango.model('User')

  UserQuery = User.update({
    firstName: 'John'
  })
    .one()
    .where({
      _key: '@{^.user}'
    })
    // .name('u')
    .return()

  // test1()
  // test2()
  // test3()
  // test4()
  // test5()
  // test6()
  // test7()
  // test8()
  // test9()
  // test10()
  // test11()
  // test12() // TODO: new Model().save()
  // test13()
  test14()
}

main()
