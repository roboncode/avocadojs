const fs = require('fs')
const path = require('path')
require('app-module-path').addPath(__dirname)
const orango = require('orango')
require('colors')

let Identity, User, UserQuery
let sampleDB = orango.get('sample')

function formatJSON(data, indent = false) {
  return JSON.stringify(data, null, indent ? 2 : 0)
}

function read(dir, ...injections) {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    let file = files[i]
    if (file.match(/.js$/)) {
      let item = require(path.join(dir, file))
      if (typeof item === 'function') {
        item.apply(item, injections)
      }
    }
  }
}

async function parseQuery(query, execute = false) {
  console.log('===================================================')
  console.log('connected'.magenta, o.name, o.connection.connected)
  console.log()
  console.log(formatJSON(query).green)
  console.log()

  // fs.writeFileSync('query.json', formatJSON(query, true), 'utf-8')

  let json = query.toJSON ? query.toJSON() : query
  let aql = await sampleDB.queryToAQL(json, true)
  console.log(aql.cyan)
  if (execute) {
    let cursor = await o.connection.db.query(aql)
    let result
    if (json.one) {
      result = await cursor.next()
    } else {
      result = await cursor.all()
    }
    if (result) {
      console.log()
      console.log(formatJSON(result).grey)
    }
    return result
  }
  return aql
}

function test1() {
  let query = Identity.update({ verified: true, bogus: true })
    .one()
    .where({ _key: '217388' })
    .name('ident')
    // .query('user', UserQuery)
    .select('name')
    .return(
      orango.return
        .append('user', 'myUser')
        .append('user', 'myUser2')
        .merge('user')
        .one()
    )

  // let results = orango.unmarshal(data, Identity)

  // console.log(formatJSON(result).green)
  // fs.writeFileSync('query.json', formatJSON(result, true), 'utf-8')
  parseQuery(query)
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

async function test6() {
  let result = await User.upsert(
    {
      name: 'user',
      firstName: 'David',
      bogus: true
    },
    {
      lastName: 'Lee Roth',
      bogus: true
    }
  )
    .one()
    .withDefaults()
    .where({
      firstName: 'David'
    })
    .return({ one: true })
  
  let user = User.fromJSON(result)
  console.log(user)
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

async function test11() {
  let result = await User.find()
    .limit(1)
    .return({ one: true })
  console.log(result)
}

async function test12() {
  // this will try and update because you are passing a key
  let user = new User({
    _key: '67027',
    lastName: 'Doe'
  })
  user.firstName = 'John'
  await user.save()
  console.log(user)
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
      orango.return
        .append('user', 'myUser')
        .append('user', 'myUser2')
        .merge('user')
    )

  console.log(formatJSON(result, false).green)
  let aql = await result.toAQL(true)
  console.log(aql.cyan)
}

async function test14() {
  let result = await User.insert({
    firstName: 'Eddie',
    lastName: 'VanHalen',
    bogus: true
  }).return()

  console.log(result)
}

async function test15() {
  let result = await User.insert({
    firstName: 'Eddie',
    lastName: 'VanHalen',
    bogus: true
  }).return(orango.return.one())

  console.log(result)
}

async function test16() {
  User.on('hook:insert', payload => {
    console.log('INSERT'.magenta, payload.query)
  })

  User.on('hook:inserted', payload => {
    console.log('INSERTED'.magenta, payload.data)
  })

  let user = new User({
    firstName: 'James',
    lastName: 'Dean'
  })
  await user.save()
  console.log('Name:'.green, user.fullName)
  user.firstName = 'Rob'
  user.lastName = 'Taylor'
  user.bogus = true
  await user.save()
  console.log('Name:'.green, user.fullName)
}

async function test17() {
  let result = await User.find().byId(64667)
  let user = User.fromJSON(result)
  console.log(user.fullName.green, user)
}

async function main() {
  await sampleDB.connect()

  read(__dirname + '/models', sampleDB)

  Identity = sampleDB.model('Identity')
  User = sampleDB.model('User')

  UserQuery = User.update({
    firstName: 'John'
  })
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
  // test12() // pass
  // test13() // pass
  // test14() // pass
  // test15() // pass
  test16() // pass
  // test17() // pass
}

main()
