let expect = require('chai').expect
let orango = require('../lib')
let Orango = require('../lib/Orango')
require('colors')

describe('orango connection', function() {
  let dbName = 'test_' + orango.uid()

  describe('with no options', function() {
    it('connect to default _system db', async function() {
      let conn = await orango.connect()
      expect(conn.url + '/' + conn.name).to.equal(
        'http://localhost:8529/_system'
      )
    })
  })

  describe('with options', function() {
    it('connect to "test" db', async function() {
      let conn = await Orango.get('conn-test').connect('test')
      expect(conn.url + '/' + conn.name).to.equal('http://localhost:8529/test')
    })
  })

  describe('check if connected', function() {
    it('to be connected', async function() {
      expect(orango.connection.connected).to.equal(true)
    })
  })

  describe('creaate to new database', function() {
    it('create a new databae', async function() {
      let conn = await orango.connect(dbName)
      let dbs = await conn.db.listDatabases()
      expect(dbs).to.contain(dbName)

      conn = await orango.connect()
      await orango.dropDatabase(dbName)

      dbs = await conn.db.listDatabases()
      expect(dbs).not.to.contain(dbName)
    })
  })

  describe('disconnect from database', function() {
    it('be disonnected', async function() {
      try {
        debugger
        await orango.disconnect()
      } catch (e) {
        console.log('ERROR'.bgRed, e.message)
      }
      expect(orango.connection.connected).equal(false)
    })
  })
})
