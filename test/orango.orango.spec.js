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
        let testOrango = Orango.get('test-notconnected')
        await testOrango.createCollection('test')
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('create edge collection', function() {
    it('create an edge collection', async function() {
      let testOrango = Orango.get('test-notconnected')
      await testOrango.connect()
      let col = await testOrango.createEdgeCollection('edge_col_' + Date.now())
      expect(col.name).to.be.equal('edge_col')
    })
  })

  describe('index collection that does not exist', function() {
    it('should throw an error', async function() {
      let result
      try {
        let testOrango = Orango.get('test-truncated')
        await testOrango.connect()
        await testOrango.ensureIndexes('test-bogus')
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
    describe('definition', function() {
      let schema = orango.Schema({ name: String })
      let Test = orango.model('Test', schema)
      it('to return instance of model class', function() {
        expect(Test.name).to.equal('Test')
      })
    })

    describe('get model as class', function() {
      let schema = orango.Schema({ name: String })
      orango.model('Test', schema)
      let Test = orango.model('Test')
      it('to return instance of model class', function() {
        expect(Test.name).to.equal('Test')
      })
    })

    describe('get model that has not been defined', function() {
      it('to throw a Not Found error', function() {
        let fn = function() {
          orango.model('Bogus')
        }
        expect(fn).to.throw('Model not found')
      })
    })

    describe('get model collection name', function() {
      const schema = orango.Schema({ name: String })
      const MyTest = orango.model('MyTest', schema)
      it('to be pluralized version of name', function() {
        expect(MyTest.collectionName).to.equal('my_tests')
      })
    })

    describe('get model collection name from overridden name', function() {
      const schema = orango.Schema({ name: String })
      const MyTest = orango.model('MyTest', schema, 'tests')
      it('to use custom name', function() {
        expect(MyTest.collectionName).to.equal('tests')
      })
    })
  })
})
