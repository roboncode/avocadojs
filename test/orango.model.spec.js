let Model = require('../lib/Model')
let ORM = require('../lib/ORM')
let { ERRORS, RETURN } = require('../lib/consts')

describe('orango model', function() {

  let orango;

  beforeAll(async(done) => {
    orango = global.__ORANGO__;
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
    await orango.model('ModelTest', schema)
    done()
  })

  describe('create a new Model() with schema object', function() {
    it('should create a new model`', function() {
      let model = new Model({ name: 'Test' }, { name: String })
      expect(model.name).toBe('Test')
    })
  })

  describe('creates a new model with bogus name as object instead of string', function() {
    it('should have a name `Test`', async function(done) {
      let result
      try {
        await orango.model('Bogus', {}, {})
      } catch (error) {
        expect(error.message).toContain("factory expects")
        done()
      }
    })
  })

  describe('creates a new model adding data into constructor', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let modelTest = new ModelTest({
        name: 'Test'
      })
      expect(modelTest.name).toBe('Test')
    })
  })

  describe('creates a new model adding data as prop', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let modelTest = new ModelTest()
      modelTest.name = 'Test'
      expect(modelTest.name).toBe('Test')
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
      const ModelTest = await orango.model('Test' + Date.now(), schema)
      let modelTest = new ModelTest()
      modelTest.name = 'Test'
      expect(modelTest.name).toBe('Test')
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
      const ModelTest = await orango.model('Test' + Date.now(), schema)
      ModelTest.fullName()
      expect(typeof ModelTest.fullName).toBe('function')
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
              fields: [ 'name' ]
            },
            {
              type: 'skipList',
              fields: [ 'name' ]
            }
          ]
        }
      )

      let IndexModel = await orango.model('IndexTest', schema)
      const indexes = await IndexModel.getCollection().indexes()

      expect(indexes.length).toBe(3)
      expect(indexes[1].type).toBe('hash')
      expect(indexes[1].fields).toEqual([ 'name' ])
      expect(indexes[2].type).toBe('skiplist')
      expect(indexes[2].fields).toEqual([ 'name' ])
    })
  })


  describe('save', function() {
    it('should have a _key', async function() {
      const ModelTest = orango.model('ModelTest')
      let modelTest = new ModelTest()
      modelTest.name = 'new'
      await modelTest.save()
      expect(typeof modelTest._key).toBe('string')
    })
  })

  describe('save as new', function() {
    it('new key should exist', async function() {
      const ModelTest = orango.model('ModelTest')
      let modelTest = new ModelTest()
      await modelTest.save({ saveAsNew: true })
      expect(typeof modelTest._key).toBe('string')
    })
  })

  describe('save return AQL', function() {
    it('return AQL ', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      let result = await test.save().toAQL()
      expect(result).toBe('NEW DOCUMENT')
    })
  })

  xdescribe('create document with sets', function() {
    it('return AQL with', async function() {
      const ModelTest = orango.model('ModelTest')
      const Test = orango.model('Test')
      let result = await ModelTest.findById('rob')
        .set('myObj', { abc: 123 }, true)
        .set('myStr', 'Hello, world!')
        .set('test', Test.findById('@@parent.role').select('permissions').id().computed(true), true)
        // .set('test2', Test.find({role: 'admin'}).select('permissions').id().computed(true))
        .set('test2', Test.find().select('permissions').id().computed(true))
        .select('firstName lastName')
        .toAQL()
      console.log('#RESULT', result)
      expect(result.split('LET').length - 1).toBe(7)
    })
  })

  xdescribe('create documents with sets', function() {
    it('return AQL with', async function() {
      ORM.counter = 1
      const ModelTest = orango.model('ModelTest')
      const Test = orango.model('Test')
      let result = await ModelTest.find({ admin: true })
        .set('myObj', { abc: 123 }, true)
        .set('myStr', 'Hello, world!')
        .set('test', Test.findById('@@parent.role').select('permissions').id().computed(true), true)
        .set('test2', Test.findById('@@parent.role').select('junk').id().computed(true))
        .select('firstName lastName')
        .toAQL()
      expect(result.split('LET').length - 1).toBe(6)
    })
  })

  describe('import', function() {
    it('should import data', async function() {
      const ModelTest = orango.model('ModelTest')
      let result = await orango.importDocs(
        ModelTest,
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
      expect(result.created).toBe(2)
    })
  })

  describe('update using toAQL()', function() {
    it('should return AQL', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      test.name = 'Test'

      let aql = await test.save().toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $model_test IN model_tests FILTER ($model_test.`_key` == "' +
          test._key +
          '") LIMIT 1 UPDATE $model_test WITH {"name":"Test"} IN model_tests OPTIONS {"keepNull":false} RETURN 1) RETURN { modified }'
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

      let aql = await test.save({ saveAsNew: true }).toAQL()
      expect(aql).toBe('NEW DOCUMENT')
    })
  })

  describe('printAQL on find', function() {
    it('print AQL query', async function() {
      const ModelTest = orango.model('ModelTest')
      let aql = await ModelTest.find().toAQL()
      expect(aql).toBeDefined()
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

      let aql = await ModelTest.find()
        .defaults(true)
        .sort('firstName')
        .offset(1)
        .limit(2)
        .computed(true)
        .select('firstName')
        .toAQL()

      expect(aql).toBe(
        'FOR $model_test IN model_tests SORT $model_test.firstName LIMIT 1,2 RETURN KEEP($model_test, "firstName")'
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
        .defaults(true)
        .sort('firstName')
        .offset(1)
        .limit(2)
        .computed(true)
        .select('_key firstName')
        .id()
      // .toAQL()

      expect(results[0].greeting).toEqual('I am Geddy')
      expect(results[0].id).toBeDefined()
      expect(results[0]._key).toBeFalsy()
      expect(results[1].greeting).toEqual('I am Neal')
    })
  })

  describe('update', function() {
    it('SHOULD UPDATE #1', async function() {
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

      let result = await ModelTest.updateMany(
        {},
        {
          name: 'update'
        }
      )
      expect(result.modified).toBe(3)
    })
  })

  describe('update', function() {
    it('SHOULD UPDATE #2', async function() {
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

      let result = await ModelTest.updateMany(
        {},
        {
          name: 'update'
        }
      )
      expect(result.modified).toBe(3)
    })
  })

  describe('findByIdAndUpdate with bogus id #1???', function() {
    it('should have a name `Test`', async function(done) {
      const ModelTest = orango.model('ModelTest')
      let result
      try {
        result = await ModelTest.findByIdAndUpdate(null, {
          name: 'update'
        })
      } catch (error) {
        expect(error.message).toEqual('Id required')
        done()
      }
    })
  })

  describe('findByIdAndUpdate with bogus id #2', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let result = await ModelTest.findByIdAndUpdate('bogus', {
        name: 'update'
      })
      expect(result).toBeUndefined()
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
      expect(result._key).toBe(test._key)
    })
  })

  describe('findByIdAndUpdate return new', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      let result = await ModelTest.findByIdAndUpdate(test._key, {
        name: 'update'
      })
      .return(RETURN.DOC)
      // .toAQL()

      expect(result.name).toBe('update')
    })
  })

  describe('findByIdAndUpdate return old', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      test.name = 'new'
      await test.save()
      let result = await ModelTest.findByIdAndUpdate(test._key, {
        name: 'changed'
      }).return(RETURN.OLD)
      expect(result.name).toBe('new')
    })
  })

  describe('findByIdAndUpdate return old and new', function() {
    it('should have a name `Test`', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      let result = await ModelTest.findByIdAndUpdate(test._key, {
        name: 'changed'
      }).return(RETURN.NEW_OLD)
      expect(result.old).toBeDefined()
      expect(result.new).toBeDefined()
    })
  })

  describe('findByQuery', function() {
    it('find an item', async function() {
      const ModelTest = orango.model('ModelTest')
      let modelTest = new ModelTest({ name: 'Test' })
      await modelTest.save()
      let result
      try {
        result = await ModelTest.findByQuery(`FOR @@doc IN @@collection FILTER @@doc._key == '${modelTest._key}'`)
          .id()
          .one()
      } catch (e) {
        result = e
      }
      expect(result.id).toEqual(modelTest._key)
    })
  })

  describe('findMany with no connection', function() {
    it('should throw an error', async function(done) {
      let result
      try {
        let orangoTest = orango.get('random_' + Date.now())
        let Test = orangoTest.model('Test')
        result = Test.getCollection()
      } catch (error) {
        expect(error.message).toEqual("Model not found: Test")
        done()
      }
    })
  })

  describe('findById with no key', function() {
    it('return error', async function(done) {
      const ModelTest = orango.model('ModelTest')
      let result
      try {
        result = await ModelTest.findById()
      } catch (error) {
        expect(error.message).toEqual("Id required")
        done()
      }
    })
  })

  describe('findById', function() {
    it('return doc', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      let result = await ModelTest.findById(test._key).id().select('_key')
      expect(result.id).toBe(test._key)
    })
  })

  describe('findByIdAndDelete with no id', function() {
    it('throw an error', async function(done) {
      const ModelTest = orango.model('ModelTest')
      try {
        result = await ModelTest.findByIdAndDelete()
      } catch (error) {
        expect(error.message).toEqual("Id required")
        done()
      }
    })
  })

  describe('findByIdAndDelete', function() {
    it('delete an item', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      let result = await ModelTest.findByIdAndDelete(test._key)
      expect(result._key).toBe(test._key)
    })
  })

  describe('findById return orm', function() {
    it('return ORM', async function() {
      const ModelTest = orango.model('ModelTest')
      let orm = ModelTest.find({})
      expect(orm.constructor.name).toBe('ORM')
    })
  })

  describe('delete all', function() {
    it('will delete all records', async function() {
      const ModelTest = orango.model('ModelTest')
      await new ModelTest().save()
      await ModelTest.deleteMany({}, {})
    })
  })

  describe('remove', function() {
    it('removes doc', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      expect(typeof test._key).toBe('string')
      await test.remove()
      expect(test._key).toBeUndefined()
    })
  })

  describe('count', function() {
    it('count collection', async function() {
      const ModelTest = orango.model('ModelTest')
      await new ModelTest().save()
      await new ModelTest().save()
      await new ModelTest().save()
      let count = await ModelTest.count()
      expect(count).toBeGreaterThan(2)
    })
  })

  describe('truncate', function() {
    it('truncate collection', async function() {
      const ModelTest = orango.model('ModelTest')
      await new ModelTest().save()
      await ModelTest.truncate()
      let count = await ModelTest.count()
      expect(count).toBe(0)
    })
  })
})
