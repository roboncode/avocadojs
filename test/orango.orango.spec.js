let expect = require('chai').expect
let orango = require('../lib')
let Orango = require('../lib/Orango')

describe('Orango', function() {
  describe('get()', function() {
    it('get default instance of orango', async function() {
      let defaultOrango = await Orango.get()
      expect(defaultOrango).to.equal(orango)
    })
  })

  describe('get("test")', function() {
    it('get default instance of orango', async function() {
      let testOrango = await Orango.get('test')
      expect(testOrango).to.not.equal(orango)
    })
  })

  describe('get("test")', function() {
    it('get default instance of orango', async function() {
      let testOrango = await Orango.get('test')
      expect(testOrango).to.not.equal(orango)
    })
  })

  describe('create collection when not connected', function() {
    it('should throw an error', async function() {
      let result
      try {
        let testOrango = Orango.get('test-not-connected')
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
    describe('definition', async function() {
      let schema = orango.Schema({ name: String })
      let Test = await orango.model('DefTest', schema).ready
      it('to return instance of model class', function() {
        expect(Test.name).to.equal('DefTest')
      })
    })

    describe('get model as class', async function() {
      let Test = orango.model('Test')
      it('to return instance of model class', function() {
        expect(Test.name).to.equal('Test')
      })
    })

    describe('get model that has not been defined', function() {
      it('to throw a Not Found error', async function() {
        let result
        try {
          result = orango.model('Bogus')
        } catch(e) {
          result = e
        }
        expect(result.message).to.equal('Model not found: Bogus')
      })
    })

    describe('get model collection name', async function() {
      const schema = orango.Schema({ name: String })
      const MyTest = await orango.model('MyTest', schema).ready
      it('to be pluralized version of name', function() {
        expect(MyTest.collectionName).to.equal('my_tests')
      })
    })

    describe('get model collection name from overridden name', async function() {
      const schema = orango.Schema({ name: String })
      const MyTest = await orango.model('MyTest', schema, 'tests')
      it('to use custom name', function() {
        expect(MyTest.collectionName).to.equal('tests')
      })
    })
  })
})
