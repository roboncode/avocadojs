let expect = require('chai').expect
let Schema = require('../lib/Schema')

describe('orango schema', () => {
  describe('new schema', () => {
    it('should create a new schema that support "_key', async () => {
      let schema = new Schema({})
      let data = await schema.validate({
        _key: 'test'
      })
      expect(data).to.deep.equal({ _key: 'test' })
    })
  })
})
