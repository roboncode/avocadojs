const expect = require('chai').expect
const ORM = require('../arango/ORM')

describe('arango.orm', () => {
  describe('for in', () => {
    const orm = new ORM()
    orm.action('find')
    orm.collection({ name: 'users' })
    
    const query = orm.toAQL()

    it('should do something', () => {
      expect(query).to.contain('FOR doc IN users RETURN doc')
    })
  })

  describe('for in with filter', () => {
    const orm = new ORM()
    orm.action('find')
    orm.collection({ name: 'users' })
    orm.criteria({
      name: 'rob'
    })
    
    const query = orm.toAQL()

    it('should do something', () => {
      expect(query).to.contain('FOR doc IN users FILTER (doc.`name` == "rob") RETURN doc')
    })
  })

  describe('for in with $or filter', () => {
    const orm = new ORM()
    orm.action('find')
    orm.collection({ name: 'users' })
    orm.criteria({
      $or: [
        {name: 'rob'},
        {name: 'john'}
      ]
    })
    
    const query = orm.toAQL()

    it('should do something', () => {
      expect(query).to.contain('FOR doc IN users FILTER ((doc.`name` == "rob") OR (doc.`name` == "john")) RETURN doc')
    })
  })
  
})


/*
POST = {id: 1, text: "Hello"}
USER = {_key: 'rob', name: "Rob"}
POST_USERS = {post: 1, user: "rob"}
*/