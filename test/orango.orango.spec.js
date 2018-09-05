let expect = require('chai').expect
let orango = require('../lib')

describe('orango', function() {
  describe('get()', function() {
    it('get default instance of orango', async function() {
      let defaultOrango = await orango.get()
      expect(defaultOrango).to.equal(orango)
    })
  })

  describe('get("test")', function() {
    it('get default instance of orango', async function() {
      let testOrango = await orango.get('test')
      expect(testOrango).to.not.equal(orango)
    })
  })

  describe('get("test")', function() {
    it('get default instance of orango', async function() {
      let testOrango = await orango.get('test')
      expect(testOrango).to.not.equal(orango)
    })
  })

  describe('connect to same database', function() {
    it('should return same connection', async function() {
      let conn = orango.connection
      await orango.connect('test')
      expect(orango.connection).to.equal(conn)
    })
  })

  describe('connect to different database without connecting', function() {
    it('throw an error', async function() {
      let result
      try {
        await orango.connect()
        result = orango.connection
      } catch (e) {
        result = e
      }
      expect(result).to.an('error')
    })
  })

  describe('create collection when not connected', function() {
    it('should throw an error', async function() {
      let result
      try {
        let testOrango = orango.get('test-not-connected')
        await testOrango.createCollection('test')
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('create edge collection', function() {
    it('create an edge collection', async function() {
      let name = 'edge_col_' + Date.now()
      let col = await orango.createEdgeCollection(name)
      expect(col.name).to.be.equal(name)
    })
  })

  describe('index collection that does not exist', function() {
    it('should throw an error', async function() {
      let result
      try {
        await orango.ensureIndexes('bogus')
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('import docs', function() {
    it('should import data as documents', async function() {
      let result = await orango.importDocs(
        'Test',
        [{ name: 'Test 1' }, { name: 'Test 2' }, { name: 'Test 3' }],
        { truncate: true }
      )
      expect(result.created).to.equal(3)
    })
  })

  describe('builder()', function() {
    it('gets a new instance of builder', async function() {
      let builder = orango.builder()
      expect(builder).to.not.be.undefined
    })
  })

  describe('uid()', function() {
    it('generates a unique id', async function() {
      let id1 = orango.uid()
      let id2 = orango.uid()
      expect(id1).to.not.equal(id2)
    })
  })

  describe('model', function() {
    describe('definition', function() {
      it('to return instance of model class', async function() {
        let schema = orango.Schema({ name: String })
        let Test = await orango.model('DefTest', schema).ready
        expect(Test.name).to.equal('DefTest')
      })
    })

    describe('get model as class', function() {
      it('to return instance of model class', async function() {
        let Test = orango.model('Test')
        expect(Test.name).to.equal('Test')
      })
    })

    describe('get model that has not been defined', function() {
      it('to throw a Not Found error', async function() {
        let result
        try {
          result = orango.model('Bogus')
        } catch (e) {
          result = e
        }
        expect(result.message).to.equal('Model not found: Bogus')
      })
    })

    describe('get model collection name', function() {
      it('to be pluralized version of name', async function() {
        const schema = orango.Schema({ name: String })
        const MyTest = await orango.model('MyTest', schema).ready
        expect(MyTest.collectionName).to.equal('my_tests')
      })
    })

    describe('get model collection name from overridden name', function() {
      it('to use custom name', async function() {
        const schema = orango.Schema({ name: String })
        const MyTest = await orango.model('CustomModel', schema, 'tests')
        expect(MyTest.collectionName).to.equal('tests')
      })
    })

    describe('create a model that already exists', function() {
      it('to throw an error', async function() {
        let result
        try {
          orango.model('Test', {})
        } catch (e) {
          result = e
        }
        expect(result.message).to.contain('already exists')
      })
    })

    describe('create document models prior to connecting', function() {
      it('should create collections', async function() {
        let customOrango = orango.get('custom')
        await customOrango.model('CustomModel', { name: String })
        await customOrango.connect('custom')
        let cols = await customOrango.connection.db.listCollections()
        expect(JSON.stringify(cols)).to.include('custom_model')
      })
    })

    describe('create edge models prior to connecting', function() {
      it('should create collections', async function() {
        let customOrango = orango.get('edge')
        const edgeSchema = orango.EdgeSchema('a', 'b')
        await customOrango.model('EdgeModel', edgeSchema)
        await customOrango.connect('edge')
        let cols = await customOrango.connection.db.listCollections()
        expect(JSON.stringify(cols)).to.include('edge_model')
      })
    })
  })
})
