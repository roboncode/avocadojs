let expect = require('chai').expect
let orango = require('../lib')
let Orango = require('../lib/Orango')

describe('orango model', function() {
  before(function() {
    // define models
    const schema = orango.Schema(
      {
        name: String
      },
      {
        strict: true
      }
    )
    orango.model('SimpleTest', schema)

    // These is for Edge Test
    const UserSchema = orango.Schema({
      name: String
    })
    orango.model('User', UserSchema)

    const PostSchema = orango.Schema({
      author: String,
      text: String
    })
    orango.model('Post', PostSchema)

    // const LikeSchema = orango.Schema({}, { edge: true })
    const LikeSchema = orango.EdgeSchema('Post', 'User')
    orango.model('Like', LikeSchema)
  })

  describe('creates a new model with bogus name', function() {
    it('should have a name `Test`', function() {
      let result
      try {
        const SimpleTest = orango.model('SimpleTest', {}, {})
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('creates a new model adding data into constructor', function() {
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
    it('should have indexes', async function() {
      // let ms = 5000
      // this.timeout(ms)

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

      // setTimeout(async function() {
        const indexes = await IndexModel.getCollection().indexes()
        expect(indexes.length).to.equal(3)
        expect(indexes[1].type).to.equal('hash')
        expect(indexes[1].fields).to.deep.equal(['name'])
        expect(indexes[2].type).to.equal('skiplist')
        expect(indexes[2].fields).to.deep.equal(['name'])
        // done()
      // }, ms - 1000)
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

  describe('import', function() {
    it('should import data', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result = await SimpleTest.importMany(
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
      const SimpleTest = orango.model('SimpleTest')
      let test = new SimpleTest()
      await test.save()
      test.name = 'Test'

      let aql = await test.toAQL()
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN simple_tests FILTER (doc.`_key` == "' +
          test._key +
          '") UPDATE doc WITH {"name":"Test"} IN simple_tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('printAQL on find', function() {
    it('print AQL query', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let results = await SimpleTest.find({}, { printAQL: 'color' })
      expect(results).to.not.be.undefined
    })
  })

  describe('findByIdAndUpdate with bogus id', function() {
    it('should have a name `Test`', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result
      try {
        result = await SimpleTest.findByIdAndUpdate(null, {
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
      const SimpleTest = orango.model('SimpleTest')
      let result = await SimpleTest.findByIdAndUpdate('bogus', {
        name: 'update'
      })
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
      })
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
      )
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
      )
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
      )
      expect(result.old).to.be.exist
      expect(result.new).to.be.exist
    })
  })

  describe('findByQuery', function() {
    it('find an item', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let simpleTest = new SimpleTest({ name: 'Test' })
      await simpleTest.save()
      let result
      try {
        result = await SimpleTest.findByQuery(
          `FOR @@doc IN @@collection FILTER @@doc._key == '${simpleTest._key}'`
        )
      } catch (e) {
        result = e
      }
      expect(result[0].id).to.deep.equal(simpleTest._key)
    })
  })

  describe('findMany with no connection', function() {
    it('should throw an error', async function() {
      let orango = Orango.get('random_' + Date.now())
      let Test = orango.model('Test', {})
      let result = Test.getCollection()
      expect(result.isError).to.be.true
      expect(result.save).to.throw('No connection to database')
    })
  })

  describe('findById with no key', function() {
    it('return error', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result
      try {
        result = await SimpleTest.findById()
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
      let result = await SimpleTest.findById(test._key)
      expect(result.id).to.equal(test._key)
    })
  })

  describe('findByIdAndDelete with no id', function() {
    it('throw an error', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let result
      try {
        result = await SimpleTest.findByIdAndDelete()
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
      let result = await SimpleTest.findByIdAndDelete(test._key)
      expect(result.deleted).to.equal(1)
    })
  })

  describe('findById return orm', function() {
    it('return ORM', async function() {
      const SimpleTest = orango.model('SimpleTest')
      let orm = await SimpleTest.find({}, { returnType: 'orm' })
      expect(orm.constructor.name).to.equal('ORM')
    })
  })

  // describe('delete all', function() {
  //   it('will delete all records', async function() {
  //     const SimpleTest = orango.model('SimpleTest')
  //     await new SimpleTest().save()
  //     await SimpleTest.deleteMany({}, {})
  //   })
  // })

  describe('findByEdge', function() {
    it('should use an edge collection to perform joins', async function() {
      const User = orango.model('User')
      const Post = orango.model('Post')
      const LikeSchema = orango.EdgeSchema('users', 'posts')
      const Like = orango.model('Like', LikeSchema)

      let john = new User({ name: 'John' })
      await john.save()

      let jane = new User({ name: 'Jane' })
      await jane.save()

      let post = new Post({ author: john._key, text: 'Hello, world!' })
      await post.save()

      let like = new Like(jane._key, post._key)
      await like.save()

      let likedUsers = await User.findByEdge(Like, post._key, {
        noDefaults: true
      })

      expect(likedUsers).to.deep.equal([
        {
          _key: jane._key,
          _id: jane._id,
          _rev: jane._rev,
          name: jane.name
        }
      ])
    })

    describe('findByEdge', function() {
      it('should use an edge collection to perform joins', async function() {
        const User = orango.model('User')
        const Post = orango.model('Post')
        const LikeSchema = orango.EdgeSchema('users', 'posts')
        const Like = orango.model('Like', LikeSchema)

        let john = new User({ name: 'John' })
        await john.save()

        let jane = new User({ name: 'Jane' })
        await jane.save()

        let post = new Post({ author: john._key, text: 'Hello, world!' })
        await post.save()

        let like = new Like(jane._key, post._key)
        await like.save()

        let likedPosts = await Post.findByEdge(Like, jane._key, {
          noDefaults: true
        })

        expect(likedPosts).to.deep.equal([
          {
            _key: post._key,
            _id: post._id,
            _rev: post._rev,
            author: john._key,
            text: post.text
          }
        ])
      })
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
      let count = await SimpleTest.count()
      expect(count).to.greaterThan(2)
    })
  })

  describe('truncate', function() {
    it('truncate collection', async function() {
      const SimpleTest = orango.model('SimpleTest')
      await new SimpleTest().save()
      await SimpleTest.truncate()
      let count = await SimpleTest.count()
      expect(count).to.equal(0)
    })
  })
})
