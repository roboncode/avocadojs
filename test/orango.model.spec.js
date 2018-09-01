let expect = require('chai').expect
let orango = require('../lib')

describe('orango model', function() {
  let key

  before(function(done) {
    // define models
    orango.model('SimpleTest', {
      name: String
    })

    // // connect to "test" database
    orango.connect('test').then(() => {
      setTimeout(done, 500)
    })
  })

  describe('test', function() {
    it('test', function() {
      expect(true).to.equal(true)
    })
  })

  describe('test', function() {
    it('test', function() {
      expect(true).to.equal(true)
    })
  })

  describe('createa a new document adding data into constructor', function() {
    it('should have a name `Test`', function() {
      const SimpleTest = orango.model('SimpleTest')
      let simpleTest = new SimpleTest({
        name: 'Test'
      })
      expect(simpleTest.name).to.equal('Test')
    })
  })

  describe('creates a new document adding data as prop', function() {
    it('should have a name `Test`', function() {
      const SimpleTest = orango.model('SimpleTest')
      let simpleTest = new SimpleTest()
      simpleTest.name = 'Test'
      expect(simpleTest.name).to.equal('Test')
    })
  })

  describe('save', function() {
    it('should have a name `Test`', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let simpleTest = new SimpleTest()
      simpleTest.name = 'new'
      let result = await simpleTest.save()
      key = result._key
      expect(result._id).to.not.be.undefined
    })
  })

  describe('findByIdAndUpdate with bogus id', function() {
    it('should have a name `Test`', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result
      try {
        result = await SimpleTest.findByIdAndUpdate(null, {
          name: 'update'
        }).exec()
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('findByIdAndUpdate with bogus id', function() {
    it('should have a name `Test`', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result = await SimpleTest.findByIdAndUpdate('bogus', {
        name: 'update'
      }).exec()
      expect(result.modified).to.equal(0)
    })
  })

  describe('findByIdAndUpdate return success', function() {
    it('should have a name `Test`', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result = await SimpleTest.findByIdAndUpdate(key, {
        name: 'update'
      }).exec()
      expect(result.modified).to.equal(1)
    })
  })

  describe('findByIdAndUpdate return new', function() {
    it('should have a name `Test`', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result = await SimpleTest.findByIdAndUpdate(
        key,
        {
          name: 'update'
        },
        { returnNew: true }
      ).exec()
      expect(result.name).to.equal('update')
    })
  })

  describe('findByIdAndUpdate return old', function() {
    it('should have a name `Test`', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result = await SimpleTest.findByIdAndUpdate(
        key,
        {
          name: 'changed'
        },
        { returnOld: true }
      ).exec()
      expect(result.name).to.equal('update')
    })
  })

  describe('findByIdAndUpdate return old and new', function() {
    it('should have a name `Test`', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result = await SimpleTest.findByIdAndUpdate(
        key,
        {
          name: 'changed'
        },
        { returnNew: true, returnOld: true }
      ).exec()
      expect(result.old).to.be.exist
      expect(result.new).to.be.exist
    })
  })

  describe('findById with no key', function() {
    it('return error', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result
      try {
        result = await SimpleTest.findById().exec()
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('findById', function() {
    it('return doc', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result = await SimpleTest.findById(key).exec()
      expect(result.id).to.equal(key)
    })
  })

  describe.only('findByIdAndDelete', function() {
    it('delete an item', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result = await SimpleTest.findByIdAndDelete('key').exec()
      expect(true).to.be(true)
    })
  })
})
