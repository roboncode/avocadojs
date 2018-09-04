let expect = require('chai').expect
let orango = require('../lib')
let Orango = require('../lib/Orango')
let CONSTS = require('../lib/consts')

describe('orango model', function() {
  before(async function() {
    await orango.model('ModelTest', {}).ready
  })

  describe('creates a new model with bogus name as object instead of string', function() {
    it('should have a name `Test`', function() {
      let result
      try {
        orango.model('Bogus', {}, {}).ready
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('creates a new model adding data into constructor', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let modelTest = new ModelTest({
        name: 'Test'
      })
      expect(modelTest.name).to.equal('Test')
    })
  })

  describe('creates a new model adding data as prop', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let modelTest = new ModelTest()
      modelTest.name = 'Test'
      expect(modelTest.name).to.equal('Test')
    })
  })

  describe('creates a new model with a Schema', function() {
    it('should have a name `Test`', async function() {
      const schema = orango.Schema({
        name: String
      })
      schema.statics = {
        fullName() {}
      }
      const ModelTest = await orango.model('Test' + Date.now(), schema).ready
      let modelTest = new ModelTest()
      modelTest.name = 'Test'
      expect(modelTest.name).to.equal('Test')
    })
  })

  describe('creates a new model with a Schema and static functino', function() {
    it('should have a static function', async function() {
      const schema = orango.Schema({
        name: String
      })
      schema.statics = {
        fullName() {}
      }
      const ModelTest = await orango.model('Test' + Date.now(), schema).ready
      ModelTest.fullName()
      expect(ModelTest.fullName).to.a('function')
    })
  })

  describe('creates a new model with indexes', function() {
    it('should have indexes', async function() {
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

      let IndexModel = await orango.model('IndexTest', schema).ready

      const indexes = await IndexModel.getCollection().indexes()
      expect(indexes.length).to.equal(3)
      expect(indexes[1].type).to.equal('hash')
      expect(indexes[1].fields).to.deep.equal(['name'])
      expect(indexes[2].type).to.equal('skiplist')
      expect(indexes[2].fields).to.deep.equal(['name'])
    })
  })

  describe('create a new model with indexes', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = await orango.model('Test' + Date.now(), {
        name: String,
        statics: {
          fullName() {}
        }
      }).ready
      expect(ModelTest.fullName).to.a('function')
    })
  })

  describe('save', function() {
    it('should have a _key', async function() {
      const ModelTest = orango.model('ModelTest')
      let modelTest = new ModelTest()
      modelTest.name = 'new'
      await modelTest.save()
      expect(modelTest._key).to.be.a('string')
    })
  })

  describe('save as new', function() {
    it('new key should exist', async function() {
      const ModelTest = orango.model('ModelTest')
      let modelTest = new ModelTest()
      let result = await modelTest.save({ saveAsNew: true })
      expect(result._key).to.be.a('string')
    })
  })

  describe('save return AQL', function() {
    it('return AQL ', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      let result = await test.toAQL()
      expect(result).to.be.equal('NEW DOCUMENT')
    })
  })

  describe('save force update but missing _key', function() {
    it('throw an error ', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      let result
      try {
        result = await test.save({ update: true })
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('import', function() {
    it('should import data', async function() {
      const ModelTest = orango.model('ModelTest')
      let result = await ModelTest.importMany(
        [
          {
            name: 'Test1'
          },
          {
            name: 'Test2',
            bogus: true
          }
        ],
        true
      )
      expect(result.created).to.equal(2)
    })
  })

  describe('update using save()', function() {
    it('should save document', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      test.name = 'Test'

      let aql = await test.toAQL()
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN model_tests FILTER (doc.`_key` == "' +
          test._key +
          '") UPDATE doc WITH {"name":"Test"} IN model_tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('printAQL on find', function() {
    it('print AQL query', async function() {
      const ModelTest = orango.model('ModelTest')
      let results = await ModelTest.find({}, { printAQL: 'color' })
      expect(results).to.not.be.undefined
    })
  })

  describe('findByIdAndUpdate with bogus id', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let result
      try {
        result = await ModelTest.findByIdAndUpdate(null, {
          name: 'update'
        })
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('findByIdAndUpdate with bogus id', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let result = await ModelTest.findByIdAndUpdate('bogus', {
        name: 'update'
      })
      expect(result.modified).to.equal(0)
    })
  })

  describe('findByIdAndUpdate return success', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      let result = await ModelTest.findByIdAndUpdate(test._key, {
        name: 'update'
      })
      expect(result.modified).to.equal(1)
    })
  })

  describe('findByIdAndUpdate return new', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      let result = await ModelTest.findByIdAndUpdate(
        test._key,
        {
          name: 'update'
        },
        { returnNew: true }
      )
      expect(result.name).to.equal('update')
    })
  })

  describe('findByIdAndUpdate return old', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      test.name = 'new'
      await test.save()
      let result = await ModelTest.findByIdAndUpdate(
        test._key,
        {
          name: 'changed'
        },
        { returnOld: true }
      )
      expect(result.name).to.equal('new')
    })
  })

  describe('findByIdAndUpdate return old and new', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      let result = await ModelTest.findByIdAndUpdate(
        test._key,
        {
          name: 'changed'
        },
        { returnNew: true, returnOld: true }
      )
      expect(result.old).to.be.exist
      expect(result.new).to.be.exist
    })
  })

  describe('findByQuery', function() {
    it('find an item', async function() {
      const ModelTest = orango.model('ModelTest')
      let modelTest = new ModelTest({ name: 'Test' })
      await modelTest.save()
      let result
      try {
        result = await ModelTest.findByQuery(
          `FOR @@doc IN @@collection FILTER @@doc._key == '${modelTest._key}'`
        )
      } catch (e) {
        result = e
      }
      expect(result[0].id).to.deep.equal(modelTest._key)
    })
  })

  describe('findMany with no connection', function() {
    it('should throw an error', async function() {
      let result
      try {
        let orango = Orango.get('random_' + Date.now())
        let Test = orango.model('Test')
        result = Test.getCollection()
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
      expect(result.message).to.equal(CONSTS.ERRORS.NOT_CONNECTED)
    })
  })

  describe('findById with no key', function() {
    it('return error', async function() {
      const ModelTest = orango.model('ModelTest')
      let result
      try {
        result = await ModelTest.findById()
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('findById', function() {
    it('return doc', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      let result = await ModelTest.findById(test._key)
      expect(result.id).to.equal(test._key)
    })
  })

  describe('findByIdAndDelete with no id', function() {
    it('throw an error', async function() {
      const ModelTest = orango.model('ModelTest')
      let result
      try {
        result = await ModelTest.findByIdAndDelete()
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('findByIdAndDelete', function() {
    it('delete an item', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      let result = await ModelTest.findByIdAndDelete(test._key)
      expect(result.deleted).to.equal(1)
    })
  })

  describe('findById return orm', function() {
    it('return ORM', async function() {
      const ModelTest = orango.model('ModelTest')
      let orm = await ModelTest.find({}, { returnType: 'orm' })
      expect(orm.constructor.name).to.equal('ORM')
    })
  })

  // describe('delete all', function() {
  //   it('will delete all records', async function() {
  //     const ModelTest = orango.model('ModelTest')
  //     await new ModelTest().save()
  //     await ModelTest.deleteMany({}, {})
  //   })
  // })

  describe('remove', function() {
    it('removes doc', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      expect(test._key).to.be.a('string')
      await test.remove()
      console.log('#result', test._key)
      expect(test._key).to.be.undefined
    })
  })

  describe('count', function() {
    it('count collection', async function() {
      const ModelTest = orango.model('ModelTest')
      await new ModelTest().save()
      await new ModelTest().save()
      await new ModelTest().save()
      let count = await ModelTest.count()
      expect(count).to.greaterThan(2)
    })
  })

  describe('truncate', function() {
    it('truncate collection', async function() {
      const ModelTest = orango.model('ModelTest')
      await new ModelTest().save()
      await ModelTest.truncate()
      let count = await ModelTest.count()
      expect(count).to.equal(0)
    })
  })
})
