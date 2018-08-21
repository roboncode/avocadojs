const expect = require('chai').expect
const ORM = require('../orango/ORM')
const orango = require('../orango')

let schema = orango.Schema({
  name: String
})

orango.model('Test', schema)

describe('orango.orm', () => {
  describe('for in', () => {
    const orm = new ORM()
    orm.action('find')
    orm.collection({ name: 'users' })

    it('should do something', async () => {
      const query = await orm.toAQL()
      expect(query).to.equal('FOR doc IN users RETURN doc')
    })
  })

  describe('for in with filter', () => {
    const orm = new ORM()
    orm.action('find')
    orm.collection({ name: 'users' })
    orm.criteria({
      name: 'rob'
    })

    it('should do something', async () => {
      const query = await orm.toAQL()
      expect(query).to.equal(
        'FOR doc IN users FILTER (doc.`name` == "rob") RETURN doc'
      )
    })
  })

  describe('$or filter', () => {
    const orm = new ORM()
    orm.action('find')
    orm.collection({ name: 'users' })
    orm.criteria({
      $or: [{ name: 'rob' }, { name: 'john' }]
    })

    it('should do something', async () => {
      const query = await orm.toAQL()
      expect(query).to.equal(
        'FOR doc IN users FILTER ((doc.`name` == "rob") OR (doc.`name` == "john")) RETURN doc'
      )
    })
  })

  describe('increment filter using $inc', () => {
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

    it('should do something', async () => {
      const query = await orm.toAQL()
      expect(query).to.equal(
        'FOR doc IN users UPDATE doc WITH {"stats":{"friends":doc.stats.friends+1}} IN users'
      )
    })
  })

  describe('increment filter using ++', () => {
    const orm = new ORM()
    orm.action('update')
    orm.collection({ name: 'users' })
    orm.model(orango.model('Test'))
    orm.data({
      friends: '++1'
    })

    it('should do something', async () => {
      const query = await orm.toAQL()
      expect(query).to.equal(
        'FOR doc IN users UPDATE doc WITH {"friends":doc.friends+1} IN users'
      )
    })
  })

  describe('increment filter using EXPR()', () => {
    const orm = new ORM()
    orm.action('update')
    orm.collection({ name: 'users' })
    orm.model(orango.model('Test'))
    orm.data({
      friends: 'EXPR(friends+1)'
    })

    it('should do something', async () => {
      const query = await orm.toAQL()
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
