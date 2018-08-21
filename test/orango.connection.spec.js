let expect = require('chai').expect
let orango = require('../lib')

describe('orango connection', function() {
  describe('with no options', function() {
    it('connect to default _system db', async function() {
      let conn = await orango.connect()
      expect(conn.url + '/' + conn.name).to.equal(
        'http://localhost:8529/_system'
      )
    })
  })
})
