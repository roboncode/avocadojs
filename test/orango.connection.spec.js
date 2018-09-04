let expect = require('chai').expect
let orango = require('../lib')
let Orango = require('../lib/Orango')
require('colors')

describe('orango connection', function() {

  describe('with no options', function() {
    it('connect to default "test" db', async function() {
      let conn = Orango.get('system').connection
      expect(conn.url + '/' + conn.name).to.equal(
        'http://localhost:8529/_system'
      )
    })
  })

  describe('with options', function() {
    it('connect to "test" db', async function() {
      let conn = orango.connection
      expect(conn.url + '/' + conn.name).to.equal('http://localhost:8529/test')
    })
  })

  describe('check if connected', function() {
    it('to be connected', async function() {
      expect(orango.connection.connected).to.equal(true)
    })
  })

  describe('create to new database', function() {
    it('create a new databae', async function() {
      let conn = Orango.get('system').connection
      let dbs = await conn.db.listDatabases()
      expect(dbs).to.contain('test')

      // conn = await orango.connect()
      // await orango.dropDatabase(dbName)

      // dbs = await conn.db.listDatabases()
      // expect(dbs).not.to.contain(dbName)
    })
  })

  xdescribe('disconnect from database', function() {
    it('be disconnect', async function() {
      try {
        await orango.disconnect()
      } catch (e) {
        console.log('ERROR'.bgRed, e.message)
      }
      expect(orango.connection.connected).equal(false)
    })
  })
})
