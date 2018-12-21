const CONSTS = require('../lib/consts')

describe('orango', function() {

  let orango;

  beforeAll(async () => {
    orango = global.__ORANGO__;
  });

  describe('get()', function() {
    it('get default instance of orango', async function() {
      let defaultOrango = await orango.get()
      expect(defaultOrango).toBe(orango)
    })
  })

  describe('get("test")', function() {
    it('get default instance of orango', async function() {
      let testOrango = await orango.get('test')
      expect(testOrango).not.toBe(orango)
    })
  })

  describe('get("test")', function() {
    it('get default instance of orango', async function() {
      let testOrango = await orango.get('test')
      expect(testOrango).not.toBe(orango)
    })
  })

  describe('connect to same database', function() {
    it('should return same connection', async function(done) {
      let conn = orango.connection
      let result
      try {
        result = await orango.connect('test')
      } catch (error) {
        expect(error.message).toEqual("Connection already established")
        done()
      }
    })
  })

  describe('create edge collection', function() {
    it('create an edge collection', async function() {
      let name = 'edge_col_' + Date.now()
      let col = await orango.createEdgeCollection(name)
      expect(col.name).toBe(name)
    })
  })

  describe('index collection that does not exist', function() {
    it('should throw an error', async function(done) {
      let result
      try {
        await orango.ensureIndexes('bogus')
      } catch (error) {
        expect(error.message).toEqual("Collection not found: bogus")
        done()
      }
    })
  })

  describe('import docs', function() {
    it('should import data as documents', async function() {
      let result = await orango.importDocs(
        'Test',
        [
          {
            name: 'Test 1'
          },
          {
            name: 'Test 2'
          },
          {
            name: 'Test 3'
          }
        ],
        {
          truncate: true
        }
      )
      expect(result.created).toBe(3)
    })
  })

  xdescribe('import docs without a connection', function() {
    it('throw an error', async function(done) {
      let result
      try {
        let importOrango = orango.get('import')
        importOrango.model('ImportTest', {
          name: String
        })
        result = await importOrango.importDocs(
          'ImportTest',
          [
            {
              name: 'One'
            }
          ],
          {
            truncate: true
          }
        )
      } catch (error) {
        expect(error.message).toEqual(expect.arrayContaining(['Not connected to database']))
        done()
      }
    })
  })

  describe('builder()', function() {
    it('gets a new instance of builder', async function() {
      let builder = orango.builder()
      expect(builder).toBeDefined()
    })
  })

  describe('uid()', function() {
    it('generates a unique id', async function() {
      let id1 = orango.uid()
      let id2 = orango.uid()
      expect(id1).not.toBe(id2)
    })
  })

  describe('model', function() {
    describe('definition', function() {
      it('to return instance of model class', async function() {
        let schema = orango.Schema({
          name: String
        })
        let Test = await orango.model('DefTest', schema)
        expect(Test.name).toBe('DefTest')
      })
    })

    describe('get model as class', function() {
      it('to return instance of model class', async function() {
        let Test = orango.model('Test')
        expect(Test.name).toBe('Test')
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
        expect(result.message).toBe('Model not found: Bogus')
      })
    })

    describe('get model collection name', function() {
      it('to be pluralized version of name', async function() {
        const schema = orango.Schema({
          name: String
        })
        const MyTest = await orango.model('MyTest', schema)
        expect(MyTest.collectionName).toBe('my_tests')
      })
    })

    describe('get model collection name from overridden name', function() {
      it('to use custom name', async function() {
        const schema = orango.Schema({
          name: String
        })
        const MyTest = await orango.model('CustomModel', schema, 'tests')
        expect(MyTest.collectionName).toBe('tests')
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
        expect(result.message).toContain('already exists')
      })
    })

    describe('create document models prior to connecting', function() {
      it('should create collections', function(done) {
        let customOrango = orango.get('custom')
        customOrango
          .model('CustomModel', {
            name: String
          })
          .once(CONSTS.EVENTS.READY, async () => {
            let cols = await customOrango.connection.db.listCollections()
            expect(cols[0]).toHaveProperty('name','custom_models')
            done()
          })
        customOrango.connect('custom')
      })
    })

    describe('create edge models prior to connecting', function() {
      it('should create collections', function(done) {
        let edgeOrango = orango.get('edge')
        const edgeSchema = orango.EdgeSchema('a', 'b')
        edgeOrango
          .model('EdgeModel', edgeSchema)
          .once(CONSTS.EVENTS.READY, async () => {
            let cols = await edgeOrango.connection.db.listCollections()
            expect(JSON.stringify(cols)).toContain('edge_model')
            done()
          })
        edgeOrango.connect('edge')
      })
    })

    describe('invoke a rawQuery', function() {
      it('should make a raw query', async function() {
        let rawOrango = orango.get('raw')
        await rawOrango.connect('custom')
        const User = await rawOrango.model('User', {
          name: String
        })

        await new User({
          name: 'Mikey'
        }).save()
        results = await rawOrango.rawQuery('FOR doc IN users RETURN doc')
        expect(results[0]._id).toBeDefined()
      })
    })
  })
})
