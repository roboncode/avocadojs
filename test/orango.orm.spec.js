const expect = require('chai').expect
const ORM = require('../lib/ORM')
const orango = require('../lib')

let schema = orango.Schema({
  name: String
})

orango.model('Test', schema)

const AQL_NEWLINE = '\n   '

describe('orango.orm', function() {
  describe('for in', function() {
    const orm = new ORM()
    orm.action('find')
    orm.collection({ name: 'users' })

    it('should do something', async function() {
      let query = await orm.toAQL()
      query = query.split(AQL_NEWLINE).join('')
      expect(query).to.equal('FOR doc IN users RETURN doc')
    })
  })

  describe('for in with filter', function() {
    const orm = new ORM()
    orm.action('find')
    orm.collection({ name: 'users' })
    orm.criteria({
      name: 'rob'
    })

    it('should do something', async function() {
      let query = await orm.toAQL()
      query = query.split(AQL_NEWLINE).join('')
      expect(query).to.equal(
        'FOR doc IN users FILTER (doc.`name` == "rob") RETURN doc'
      )
    })
  })

  describe('$or filter', function() {
    const orm = new ORM()
    orm.action('find')
    orm.collection({ name: 'users' })
    orm.criteria({
      $or: [{ name: 'rob' }, { name: 'john' }]
    })

    it('should do something', async function() {
      let query = await orm.toAQL()
      query = query.split(AQL_NEWLINE).join('')
      expect(query).to.equal(
        'FOR doc IN users FILTER ((doc.`name` == "rob") OR (doc.`name` == "john")) RETURN doc'
      )
    })
  })

  describe('increment filter using $inc', function() {
    const orm = new ORM()
    orm.action('update')
    orm.collection({ name: 'users' })
    orm.model(orango.model('Test'))
    orm.data({
      stats: {
        friends: {
          $inc: 1
        }
      }
    })

    it('should do something', async function() {
      let query = await orm.toAQL()
      query = query.split(AQL_NEWLINE).join('')
      expect(query).to.equal(
        'FOR doc IN users UPDATE doc WITH {"stats":{"friends":doc.stats.friends+1}} IN users'
      )
    })
  })

  describe('increment filter using ++', function() {
    const orm = new ORM()
    orm.action('update')
    orm.collection({ name: 'users' })
    orm.model(orango.model('Test'))
    orm.data({
      friends: '++1'
    })

    it('should do something', async function() {
      let query = await orm.toAQL()
      query = query.split(AQL_NEWLINE).join('')
      expect(query).to.equal(
        'FOR doc IN users UPDATE doc WITH {"friends":doc.friends+1} IN users'
      )
    })
  })

  describe('increment filter using EXPR()', function() {
    const orm = new ORM()
    orm.action('update')
    orm.collection({ name: 'users' })
    orm.model(orango.model('Test'))
    orm.data({
      friends: 'EXPR(friends+1)'
    })

    it('should do something', async function() {
      let query = await orm.toAQL()
      query = query.split(AQL_NEWLINE).join('')
      expect(query).to.equal(
        'FOR doc IN users UPDATE doc WITH {"friends":doc.friends+1} IN users'
      )
    })
  })
})

/*
POST = {id: 1, text: "Hello"}
USER = {_key: 'rob', name: "Rob"}
POST_USERS = {post: 1, user: "rob"}
*/
