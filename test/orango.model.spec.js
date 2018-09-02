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

  describe('createa a new model adding data into constructor', function() {
    it('should have a name `Test`', function() {
      const SimpleTest = orango.model('SimpleTest')
      let simpleTest = new SimpleTest({
        name: 'Test'
      })
      expect(simpleTest.name).to.equal('Test')
    })
  })

  describe('creates a new model adding data as prop', function() {
    it('should have a name `Test`', function() {
      const SimpleTest = orango.model('SimpleTest')
      let simpleTest = new SimpleTest()
      simpleTest.name = 'Test'
      expect(simpleTest.name).to.equal('Test')
    })
  })

  describe('creates a new model with a Schema', function() {
    it('should have a name `Test`', function() {
      const schema = orango.Schema({
        name: String
      })
      schema.statics = {
        fullName() {}
      }
      const SimpleTest = orango.model('SimpleTest', schema)
      let simpleTest = new SimpleTest()
      simpleTest.name = 'Test'
      expect(simpleTest.name).to.equal('Test')
    })
  })

  describe('creates a new model with a Schema and static functino', function() {
    it('should have a static function', function() {
      const schema = orango.Schema({
        name: String
      })
      schema.statics = {
        fullName() {}
      }
      const SimpleTest = orango.model('SimpleTest', schema)
      SimpleTest.fullName()
      expect(SimpleTest.fullName).to.a('function')
    })
  })

  describe('creates a new model with indexes', function() {
    it('should have indexes', function(done) {
      let ms = 5000
      this.timeout(ms)

      const schema = orango.Schema(
        {
          name: String
        },
        {
          indexes: [
            {
              type: 'hash',
              fields: ['name']
            },
            {
              type: 'skipList',
              fields: ['name']
            }
          ]
        }
      )

      let IndexModel = orango.model('IndexTest', schema)

      setTimeout(async function() {
        const indexes = await IndexModel.getCollection().indexes()
        expect(indexes.length).to.equal(3)
        expect(indexes[1].type).to.equal('hash')
        expect(indexes[1].fields).to.deep.equal(['name'])
        expect(indexes[2].type).to.equal('skiplist')
        expect(indexes[2].fields).to.deep.equal(['name'])
        done()
      }, ms - 1000)
    })
  })

  describe('creates an edge collection', function() {
    it('create an edge collection', function(done) {
      let ms = 5000
      this.timeout(ms)

      const schema = orango.Schema(
        {
          name: String
        },
        {
          edge: true
        }
      )
      orango.model('EdgeTest', schema)
      setTimeout(async function() {
        const cols = await orango.connection.db.listCollections()
        let str = JSON.stringify(cols)
        expect(str).to.contain('edge_tests')
        done()
      }, ms - 1000)
    })
  })

  describe('create a new model with indexes', function() {
    it('should have a name `Test`', function() {
      const SimpleTest = orango.model('SimpleTest3', {
        name: String,
        statics: {
          fullName() {}
        }
      })
      expect(SimpleTest.fullName).to.a('function')
    })
  })

  describe('save', function() {
    it('should have a name `Test`', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let simpleTest = new SimpleTest()
      simpleTest.name = 'new'
      await simpleTest.save()
      expect(simpleTest._key).to.be.a('string')
    })
  })

  describe('save as new', function() {
    it('new key should exist', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let test = new SimpleTest()
      let result = await test.save({ saveAsNew: true })
      expect(result._key).to.be.a('string')
    })
  })

  describe('save return AQL', function() {
    it('return AQL ', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let test = new SimpleTest()
      let result = await test.toAQL()
      expect(result).to.be.equal('NEW DOCUMENT')
    })
  })

  describe('save force update but missing _key', function() {
    it('throw an error ', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let test = new SimpleTest()
      let result
      try {
        result = await test.save({ update: true })
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('update using save()', function() {
    it('should save document', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let test = new SimpleTest()
      await test.save()
      test.name = 'Test'
      console.log('#before', test._key)
      let aql = await test.toAQL()
      console.log('#after', test._key)
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN simple_tests FILTER (doc.`_key` == "' +
          test._key +
          '") UPDATE doc WITH {"name":"Test"} IN simple_tests RETURN 1) RETURN { modified }'
      )
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
      let test = new SimpleTest()
      await test.save()
      let result = await SimpleTest.findByIdAndUpdate(test._key, {
        name: 'update'
      }).exec()
      expect(result.modified).to.equal(1)
    })
  })

  describe('findByIdAndUpdate return new', function() {
    it('should have a name `Test`', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let test = new SimpleTest()
      await test.save()
      let result = await SimpleTest.findByIdAndUpdate(
        test._key,
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
      let test = new SimpleTest()
      test.name = 'new'
      await test.save()
      let result = await SimpleTest.findByIdAndUpdate(
        test._key,
        {
          name: 'changed'
        },
        { returnOld: true }
      ).exec()
      expect(result.name).to.equal('new')
    })
  })

  describe('findByIdAndUpdate return old and new', function() {
    it('should have a name `Test`', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let test = new SimpleTest()
      await test.save()
      let result = await SimpleTest.findByIdAndUpdate(
        test._key,
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
      let test = new SimpleTest()
      await test.save()
      let result = await SimpleTest.findById(test._key).exec()
      expect(result.id).to.equal(test._key)
    })
  })

  describe('findByIdAndDelete with no id', function() {
    it('throw an error', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result
      try {
        result = await SimpleTest.findByIdAndDelete().exec()
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('findByIdAndDelete', function() {
    it('delete an item', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let test = new SimpleTest()
      await test.save()
      let result = await SimpleTest.findByIdAndDelete(test._key).exec()
      expect(result.deleted).to.equal(1)
    })
  })

  describe('remove', function() {
    it('removes doc', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let test = new SimpleTest()
      await test.save()
      expect(test._key).to.be.a('string')
      await test.remove()
      console.log('#result', test._key)
      expect(test._key).to.be.undefined
    })
  })

  describe('count', function() {
    it('count collection', async function() {
      const SimpleTest = orango.model('SimpleTest')
      await new SimpleTest().save()
      await new SimpleTest().save()
      await new SimpleTest().save()
      let count = await SimpleTest.count().exec()
      expect(count).to.greaterThan(2)
    })
  })

  describe('truncate', function() {
    it('truncate collection', async function() {
      const SimpleTest = orango.model('SimpleTest')
      await new SimpleTest().save()
      await SimpleTest.truncate()
      let count = await SimpleTest.count().exec()
      expect(count).to.equal(0)
    })
  })
})
