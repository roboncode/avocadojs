let expect = require('chai').expect
let orango = require('../lib')
let Model = require('../lib/Model')
let ORM = require('../lib/ORM')
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
    await orango.model('ModelTest', schema)
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
        await orango.model('Bogus', {}, {})
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
      const ModelTest = await orango.model('Test' + Date.now(), schema)
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
      const ModelTest = await orango.model('Test' + Date.now(), schema)
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

      let IndexModel = await orango.model('IndexTest', schema)
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
      })
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
      await modelTest.save({ saveAsNew: true })
      expect(modelTest._key).to.be.a('string')
    })
  })

  describe('save return AQL', function() {
    it('return AQL ', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      let result = await test.save().toAQL()
      expect(result).to.be.equal('NEW DOCUMENT')
    })
  })

/*
  //LET doc_sktwi1kmfjmq527ns = DOCUMENT('users/rob') 
//LET permissions = (LET doc_sktwi1kmfjmq527nt = DOCUMENT(doc_sktwi1kmfjmq527ns.role) RETURN KEEP(doc_sktwi1kmfjmq527nt, "permissions")) 
//RETURN MERGE(KEEP(doc_sktwi1kmfjmq527ns, "_key","email","firstName","lastName","role"), {})
LET doc_sktwi1l07jmq6nili = KEEP(DOCUMENT('users/rob'), "_key","email","firstName","lastName","role")
LET role = KEEP(DOCUMENT(CONCAT('user_roles/', doc_sktwi1l07jmq6nili.role)), "permissions")
RETURN MERGE(doc_sktwi1l07jmq6nili, role)

LET doc_sktwi1l65jmqeq0eg = DOCUMENT('model_tests/rob') 
LET test = (
    LET doc_sktwi1l65jmqeq0eh = DOCUMENT('tests/@@parent.role') 
    RETURN KEEP(doc_sktwi1l65jmqeq0eh, "permissions")
) 
RETURN MERGE(KEEP(doc_sktwi1l65jmqeq0eg, "firstName","lastName"), test)


LET doc_sktwi1l9yjmqewfkl = DOCUMENT('model_tests/rob') 
LET test2 = (
    FOR doc_sktwi1l9yjmqewfkm IN tests 
    FILTER (doc_sktwi1l9yjmqewfkm.`name` == "rob") 
    RETURN KEEP(doc_sktwi1l9yjmqewfkm, "junk")
) 
RETURN MERGE(KEEP(doc_sktwi1l9yjmqewfkl, "firstName","lastName"), {test2})


LET doc_sktwi1lbdjmqf0qqc = DOCUMENT('model_tests/rob') 
LET test = DOCUMENT('tests/@@parent.role') RETURN KEEP(test, "permissions")
RETURN MERGE(KEEP(doc_sktwi1lbdjmqf0qqc, "firstName","lastName"), test)
/*
//LET doc = DOCUMENT('users/rob')
FOR doc IN users
    LET perm = (KEEP(DOCUMENT(CONCAT('user_roles/', doc.role || 'user')), 'permissions'))
    LET cats = (FOR doc_1 in categories RETURN doc_1)
    RETURN MERGE(doc, perm, {cats} )

FOR doc IN model_tests FILTER (doc.`admin` == true) 
    LET myObj = {"abc":123} 
    LET myStr = "Hello, world!" 
    LET test = (LET doc_1 = KEEP( DOCUMENT(doc.role) ,'permissions') RETURN doc_1) 
    LET test2 = (LET doc_2 = KEEP( DOCUMENT(doc.role) ,'junk') RETURN doc_2) 
    RETURN MERGE(KEEP(doc, "firstName","lastName"), myObj, {myStr}, test, {test2})

LET doc_1 = DOCUMENT('model_tests/rob') 
LET myObj = {"abc":123} LET myStr = "Hello, world!" 
LET test = (LET doc_2 = DOCUMENT(doc_1.role) RETURN doc_2) 
LET test2 = (LET doc_3 = DOCUMENT(doc_1.role) RETURN doc_3) 
RETURN MERGE(KEEP(doc_1, "firstName","lastName"), myObj, {myStr}, test, {test2})

FOR doc IN model_tests FILTER (doc.`admin` == true) 
    LET myObj = {"abc":123} 
    LET myStr = "Hello, world!" 
    LET test = (LET doc_1 = DOCUMENT(doc.role) RETURN KEEP(doc_1, "permissions"))
    LET test2 = (LET doc_2 = DOCUMENT(doc.role) RETURN KEEP(doc_2, "junk")) 
    RETURN MERGE(KEEP(doc, "firstName","lastName"), myObj, {myStr}, test, {test2})

/*
LET doc_1 = DOCUMENT('model_tests/rob') 
LET test = (LET doc_2 = KEEP( DOCUMENT(doc_1.role') ,'permissions) RETURN doc_2) 
RETURN MERGE(doc_1, {test})

LET doc_1 = DOCUMENT('model_tests/rob') 
LET myObj = {"abc":123} 
LET myStr = "Hello, world!" 
LET test = (LET doc_2 = KEEP( DOCUMENT(doc_1.role) ,'permissions') RETURN doc_2) 
LET test2 = (LET doc_3 = KEEP( DOCUMENT(doc_1.role) ,'junk') RETURN doc_3) 
RETURN MERGE(doc_1, myObj, {myStr}, test, {test2})

/*
User.findById('rob')
//.populate('permissions', UserRole.findById('@@doc.role'))
.merge(UserRole.findById('@@doc.role').select('permissions'))
.set('category', Categories.findById('movies').select('title content'))

User.findById('rob')
.var('category', Categories, 'movies')
.populate('category', 'category', {select: 'title content'})

User.findById('rob')
.set('category', Categories.findById('movies').select('title content').id().computed(true))

*/

//RETURN KEEP(DOCUMENT('users/rob'), 'firstName', 'lastName')
//RETURN KEEP( DOCUMENT('model_tests/12914')  'firstName', 'lastName')
//RETURN KEEP( DOCUMENT('users/rob')  , 'junk')
// var('role', UserRole')
// join('permission', User_Role, )
/*
FOR doc IN users 
    FILTER (doc.`_key` == "rob") 
    LET role = KEEP(DOCUMENT(CONCAT('user_roles/', doc.role)), 'permissions')
    LET category = DOCUMENT('categories/movies')
    RETURN MERGE(doc, role, {category} )
    
let userRole = UserRole.find().toAQL()
let comments = Comment.find().toAQL()
User.find()
.var(*userRole", userRole)
.var(*comments", comments)
User.find().join("permissions", "userRole")    
    
/*
FOR doc IN user_roles FILTER (doc.`_key` == "admin") RETURN { _key : doc._key , permissions : doc.permissions }

User.findById('rob')
.merge(UserRole.findById('@@doc.role').select('permissions'), 'permissions')'
*/

  describe.only('create document with sets', function() {
    it('return AQL with', async function() {
      const ModelTest = orango.model('ModelTest')
      const Test = orango.model('Test')
      let result = await ModelTest.findById('rob')
      // .set('myObj', {abc: 123}, true)
      // .set('myStr', "Hello, world!")
      .set('test', Test.findById('@@parent.role').select('permissions').id().computed(true), true)
      // .set('test2', Test.find({name: 'rob'}).select('junk').id().computed(true))
      .select('firstName lastName')
      .toAQL()
      console.log('#RESULT', result)
      expect(result.split('LET').length - 1).to.be.equal(7)
    })
  })

  describe('create documents with sets', function() {
    it('return AQL with', async function() {
      ORM.counter = 1
      const ModelTest = orango.model('ModelTest')
      const Test = orango.model('Test')
      let result = await ModelTest.find({admin: true})
      .set('myObj', {abc: 123}, true)
      .set('myStr', "Hello, world!")
      .set('test', Test.findById('@@parent.role').select('permissions').id().computed(true), true)
      .set('test2', Test.findById('@@parent.role').select('junk').id().computed(true))
      .select('firstName lastName')
      .toAQL()
      expect(result.split('LET').length - 1).to.be.equal(6)
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
      expect(result.created).to.equal(2)
    })
  })

  describe('update using toAQL()', function() {
    it('should return AQL', async function() {
      const ModelTest = orango.model('ModelTest')
      let test = new ModelTest()
      await test.save()
      test.name = 'Test'

      let aql = await test.save().toAQL()
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

      let aql = await test.save({ saveAsNew: true }).toAQL()
      expect(aql).to.equal('NEW DOCUMENT')
    })
  })

  describe('printAQL on find', function() {
    it('print AQL query', async function() {
      const ModelTest = orango.model('ModelTest')
      let results = await ModelTest.find().toAQL()
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
        .defaults(true)
        .sort('firstName')
        .offset(1)
        .limit(2)
        .computed(true)
        .select('firstName')
        .toAQL()

      expect(results).to.equal(
        'FOR doc IN model_tests SORT doc.firstName LIMIT 1,2 RETURN KEEP(doc, "firstName")'
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

      expect(results[0].greeting).to.deep.equal('I am Geddy')
      expect(results[0].id).to.exist
      expect(results[0]._key).to.not.exist
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

      let result = await ModelTest.updateMany(
        {},
        {
          name: 'update'
        }
      )
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

      let result = await ModelTest.updateMany(
        {},
        {
          name: 'update'
        }
      ).options({
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
      let result = await ModelTest.findById(test._key)
        .id()
        .select('_key')
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
