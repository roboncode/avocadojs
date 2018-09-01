let expect = require('chai').expect
let orango = require('../lib')

xdescribe('orango connection', function() {
  describe('with no options', function() {
    it('connect to default _system db', async function() {
      let conn = await orango.connect()
      expect(conn.url + '/' + conn.name).to.equal(
        'http://localhost:8529/_system'
      )
    })
  })

  describe('with options', function() {
    it('connect to default "test" db', async function() {
      let conn = await orango.connect('test')
      expect(conn.url + '/' + conn.name).to.equal('http://localhost:8529/test')
    })
  })

  describe('check if connected', function() {
    it('to be connected', async function() {
      expect(orango.connection.connected).to.equal(true)
    })
  })
})
