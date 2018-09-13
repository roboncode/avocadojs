let expect = require('chai').expect
let orango = require('../lib')
let Model = require('../lib/Model')
let CONSTS = require('../lib/consts')

describe('orango model', function() {
  before(async function() {
    let schema = orango.Schema(
      {
        name: String,
        firstName: String,
        lastName: String,
        created: { type: Date, default: Date.now }
      },
      {
        strict: true,
        keepNull: true,
        removeOnMatchDefault: true
      }
    )
    schema.computed.greeting = function() {
      return 'I am ' + this.firstName
    }
    await orango.model('ModelTest', schema).onReady
  })

  describe('create a new Model() with schema object', function() {
    it('should create a new model`', function() {
      let model = new Model({ name: 'Test' }, { name: String })
      expect(model.name).to.equal('Test')
    })
  })

  describe('creates a new model with bogus name as object instead of string', function() {
    it('should have a name `Test`', async function() {
      let result
      try {
        await orango.model('Bogus', {}, {}).onReady
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
      const ModelTest = await orango.model('Test' + Date.now(), schema).onReady
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
      const ModelTest = await orango.model('Test' + Date.now(), schema).onReady
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

      let IndexModel = await orango.model('IndexTest', schema).onReady

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
      }).onReady
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

  describe('creating a doc with a duplicate key', function() {
    it('should throw an error', async function() {
      const ModelTest = orango.model('ModelTest')
      let result
      try {
        await new ModelTest({_key: 'dup'}).save()
        await new ModelTest({_key: 'dup'}).save()
      } catch(e) {
        result = e
      }
      expect(result.message).to.equal('unique constraint violated - in index 0 of type primary over ["_key"]; conflicting key: dup')
    })
  })

  describe('update using toAQL()', function() {
    it('should return AQL', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      test.name = 'Test'

      let aql = await test.toAQL()
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN model_tests FILTER (doc.`_key` == "' +
          test._key +
          '") UPDATE doc WITH {"name":"Test"} IN model_tests OPTIONS {"keepNull":false} RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('update using toAQL() and remove keys', function() {
    it('should retlurn AQL without keys', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      test._id = '1'
      test._key = '1'
      test._rev = '1'
      test.name = 'Test'
      await test.save()

      let aql = await test.toAQL({ saveAsNew: true })
      expect(aql).to.equal('NEW DOCUMENT')
    })
  })

  describe('update using toAQL() marked as new without _key', function() {
    it('should throw an error', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      test.name = 'Test'
      test.isNew = true

      let result
      try {
        await test.toAQL({
          update: true
        })
      } catch (e) {
        result = e
      }

      expect(result).to.be.an('error')
      expect(result.message).to.equal('Missing required _key')
    })
  })

  describe('printAQL on find', function() {
    it('print AQL query', async function() {
      const ModelTest = orango.model('ModelTest')
      let results = await ModelTest.find({}, { printAQL: 'color' })
      expect(results).to.not.be.undefined
    })
  })

  describe('printAQL on find with options', function() {
    it('print AQL query', async function() {
      const ModelTest = orango.model('ModelTest')

      await new ModelTest({
        firstName: 'Geddy',
        lastName: 'Lee'
      }).save()

      await new ModelTest({
        firstName: 'Alex',
        lastName: 'Lifeson'
      }).save()

      await new ModelTest({
        firstName: 'Neal',
        lastName: 'Peart'
      }).save()

      let results = await ModelTest.find()
        .withDefaults(true)
        .sort('firstName')
        .offset(1)
        .limit(2)
        .computed(true)
        .select('firstName')
        .toAQL({
          pretty: 'color'
        })

      expect(results).to.equal(
        'FOR doc IN model_tests \n   SORT doc.firstName \n   LIMIT 1,2 \n   RETURN { _key : doc._key , firstName : doc.firstName }'
      )
    })
  })

  describe('find with options ', function() {
    it('print AQL query', async function() {
      const ModelTest = orango.model('ModelTest')

      await ModelTest.deleteMany()

      await new ModelTest({
        firstName: 'Geddy',
        lastName: 'Lee'
      }).save()

      await new ModelTest({
        firstName: 'Alex',
        lastName: 'Lifeson'
      }).save()

      await new ModelTest({
        firstName: 'Neal',
        lastName: 'Peart'
      }).save()

      let results = await ModelTest.find()
        .withDefaults(true)
        .sort('firstName')
        .offset(1)
        .limit(2)
        .computed(true)
        .select('firstName')

      expect(results[0].greeting).to.deep.equal('I am Geddy')
      expect(results[1].greeting).to.deep.equal('I am Neal')
    })
  })

  describe('update', function() {
    it('SHOULD UPDATE`', async function() {
      const ModelTest = orango.model('ModelTest')

      await ModelTest.deleteMany()

      await new ModelTest({
        firstName: 'Geddy',
        lastName: 'Lee'
      }).save()

      await new ModelTest({
        firstName: 'Alex',
        lastName: 'Lifeson'
      }).save()

      await new ModelTest({
        firstName: 'Neal',
        lastName: 'Peart'
      }).save()

      let result = await ModelTest.updateMany({}, {
        name: 'update'
      })
      expect(result.modified).to.be.equal(3)
    })
  })

  describe('update', function() {
    it('SHOULD UPDATE`', async function() {
      const ModelTest = orango.model('ModelTest')

      await ModelTest.deleteMany()

      await new ModelTest({
        firstName: 'Geddy',
        lastName: 'Lee'
      }).save()

      await new ModelTest({
        firstName: 'Alex',
        lastName: 'Lifeson'
      }).save()

      await new ModelTest({
        firstName: 'Neal',
        lastName: 'Peart'
      }).save()

      let result = await ModelTest.updateMany({}, {
        name: 'update'
      }).options({
        returnNew: true
      })
      expect(result.length).to.be.equal(3)
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

  describe('findByIdAndUpdate return new ### 1', function() {
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
        ).id()
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
        let orangoTest = orango.get('random_' + Date.now())
        let Test = orangoTest.model('Test')
        result = Test.getCollection()
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
      expect(result.message).to.equal(CONSTS.ERRORS.MODEL_NOT_FOUND + 'Test')
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
      let result = await ModelTest.findById(test._key).id()
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
      let orm = ModelTest.find({})
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
