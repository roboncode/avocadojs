let expect = require('chai').expect
let Schema = require('../lib/Schema')

describe('orango schema', function() {
  describe('new schema', function() {
    it('should create a new schema that support "_key', async function() {
      let schema = new Schema({})
      let data = await schema.validate({
        _key: 'test'
      })
      expect(data).to.deep.equal({ _key: 'test' })
    })
  })
})
