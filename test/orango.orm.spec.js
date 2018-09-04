const expect = require('chai').expect
const ORM = require('../lib/ORM')
const orango = require('../lib')

describe('orango.orm', function() {
  describe('for in', function() {
    const orm = new ORM()
    orm.action('find')
    orm.collection({ name: 'users' })

    it('should do something', async function() {
      let query = await orm.toAQL()
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
      expect(query).to.equal(
        'FOR doc IN users FILTER ((doc.`name` == "rob") OR (doc.`name` == "john")) RETURN doc'
      )
    })
  })

  describe('increment filter using $inc', function() {
    it('should do something', async function() {
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

      let query = await orm.toAQL()
      expect(query).to.equal(
        'LET modified = COUNT( FOR doc IN users UPDATE doc WITH {"stats":{"friends":doc.stats.friends+1}} IN users RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('increment filter using ++', function() {
    it('should do something', async function() {
      const orm = new ORM()
      orm.action('update')
      orm.collection({ name: 'users' })
      orm.model(orango.model('Test'))
      orm.data({
        friends: '++1'
      })

      let query = await orm.toAQL()
      expect(query).to.equal(
        'LET modified = COUNT( FOR doc IN users UPDATE doc WITH {"friends":doc.friends+1} IN users RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('increment filter using EXPR()', function() {
    it('should do something', async function() {
      const orm = new ORM()
      orm.action('update')
      orm.collection({ name: 'users' })
      orm.model(orango.model('Test'))
      orm.data({
        friends: 'EXPR(friends+1)'
      })

      let query = await orm.toAQL()
      expect(query).to.equal(
        'LET modified = COUNT( FOR doc IN users UPDATE doc WITH {"friends":doc.friends+1} IN users RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('custom query', function() {
    it('should do something', async function() {
      const orm = new ORM()
      orm.action('find')
      orm.collection({ name: 'users' })
      orm.options({ printAQL: 'color' })
      orm.query(`FOR @@doc IN @@collection FILTER device.user == @@doc._key`)
      
      let query = await orm.toAQL(true)
      expect(query).to.equal(
        'FOR doc IN users FILTER device.user == doc._key RETURN doc'
      )
    })
  })
})
