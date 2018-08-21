let expect = require('chai').expect
let orango = require('../lib')

describe('orango connection', () => {
  describe('with no options', () => {
    it('connect to default _system db', async () => {
      let conn = await orango.connect()
      expect(conn.url + '/' + conn.name).to.equal('http://localhost:8529/_system')
    })
  })
})