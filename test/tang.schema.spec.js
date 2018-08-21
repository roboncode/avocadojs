let expect = require('chai').expect
let Schema = require('../tang/Schema')
let Joi = require('joi')

describe('tang schema', function() {
  describe('empty schema', function() {
    it('throw an error', function() {
      let emptySchema = function() {
        new Schema()
      }
      expect(emptySchema).to.throw('object')
    })
  })

  describe('schema type parser', function() {
    describe('function types', function() {
      let schema = new Schema({
        test: true
      })

      let dataTypes = {
        str: String,
        num: Number,
        bool: Boolean,
        date: Date,
        arr: Array,
        obj: Object,
        fn: Function,
        joi: Joi.any(),
        schema: new Schema({ name: 'test' })
      }

      describe('String', function() {
        it('to be type "string"', function() {
          expect(schema._parseType(dataTypes.str)).to.equal('string')
        })
      })

      describe('Number', function() {
        it('to be type "number"', function() {
          expect(schema._parseType(dataTypes.num)).to.equal('number')
        })
      })

      describe('Boolean', function() {
        it('to be type "boolean"', function() {
          expect(schema._parseType(dataTypes.bool)).to.equal('boolean')
        })
      })

      describe('Date', function() {
        it('to be type "date"', function() {
          expect(schema._parseType(dataTypes.date)).to.equal('date')
        })
      })

      describe('Array', function() {
        it('to be type "array"', function() {
          expect(schema._parseType(dataTypes.arr)).to.equal('array')
        })
      })

      describe('Object', function() {
        it('to be type "object"', function() {
          expect(schema._parseType(dataTypes.obj)).to.equal('object')
        })
      })

      describe('Function', function() {
        it('to be type "func"', function() {
          expect(schema._parseType(dataTypes.fn)).to.equal('func')
        })
      })

      describe('Joi', function() {
        it('to be type "joi"', function() {
          expect(schema._parseType(dataTypes.joi)).to.equal('joi')
        })
      })

      describe('Schema', function() {
        it('to be type "schema"', function() {
          expect(schema._parseType(dataTypes.schema)).to.equal('schema')
        })
      })

      describe('undefined', function() {
        it('to be type "undefined"', function() {
          let fn = function() {
            schema._parseType()
          }
          expect(fn).to.throw('cannot')
        })
      })
    })

    describe('"type" types', function() {
      let dataTypes = {
        str: { type: String },
        num: { type: Number },
        bool: { type: Boolean },
        date: { type: Date },
        arr: { type: Array },
        obj: { type: Object },
        fn: { type: Function },
        any: { type: Proxy }
      }
      let schema = new Schema({
        test: true
      })

      describe('String', function() {
        it('to be type "string"', function() {
          expect(schema._parseType(dataTypes.str)).to.equal('string')
        })
      })

      describe('Number', function() {
        it('to be type "number"', function() {
          expect(schema._parseType(dataTypes.num)).to.equal('number')
        })
      })

      describe('Boolean', function() {
        it('to be type "boolean"', function() {
          expect(schema._parseType(dataTypes.bool)).to.equal('boolean')
        })
      })

      describe('Date', function() {
        it('to be type "date"', function() {
          expect(schema._parseType(dataTypes.date)).to.equal('date')
        })
      })

      describe('Array', function() {
        it('to be type "array"', function() {
          expect(schema._parseType(dataTypes.arr)).to.equal('array')
        })
      })

      describe('Object', function() {
        it('to be type "object"', function() {
          expect(schema._parseType(dataTypes.obj)).to.equal('object')
        })
      })

      describe('Function', function() {
        it('to be type "func"', function() {
          expect(schema._parseType(dataTypes.fn)).to.equal('func')
        })
      })

      describe('any unrecognized type', function() {
        it('to be type "object"', function() {
          expect(schema._parseType(dataTypes.any)).to.equal('object')
        })
      })
    })

    describe('literal types', function() {
      let dataTypes = {
        str: '',
        num: 1,
        bool: true,
        date: new Date(),
        arr: [],
        obj: {},
        fn: function() {}
      }
      let schema = new Schema({
        test: true
      })

      describe('String', function() {
        it('to be type "string"', function() {
          expect(schema._parseType(dataTypes.str)).to.equal('string')
        })
      })

      describe('Number', function() {
        it('to be type "number"', function() {
          expect(schema._parseType(dataTypes.num)).to.equal('number')
        })
      })

      describe('Boolean', function() {
        it('to be type "boolean"', function() {
          expect(schema._parseType(dataTypes.bool)).to.equal('boolean')
        })
      })

      describe('Date', function() {
        it('to be type "date"', function() {
          expect(schema._parseType(dataTypes.date)).to.equal('date')
        })
      })

      describe('Array', function() {
        it('to be type "array"', function() {
          expect(schema._parseType(dataTypes.arr)).to.equal('array')
        })
      })

      describe('Object', function() {
        it('to be type "object"', function() {
          expect(schema._parseType(dataTypes.obj)).to.equal('object')
        })
      })

      describe('Function', function() {
        it('to be type "func"', function() {
          expect(schema._parseType(dataTypes.fn)).to.equal('func')
        })
      })
    })
  })

  describe('single key/value schema', function() {
    let json = {
      name: String
    }
    let schema = new Schema(json, {
      noDefaults: true
    })

    it('to be schema', function() {
      expect(schema.isSchema).to.be.true
    })

    it('to keep reference to source', function() {
      expect(schema.json).to.equal(json)
    })

    it('to have a joi version of schema', function() {
      expect(schema.joi.isJoi).to.be.true
    })

    // it('to have schema key "name"', function() {
    //   expect(schema.schemaKeys).to.have.all.members(['name'])
    // })

    it('to have options with key "noDefaults"', function() {
      expect(schema.options).to.have.all.keys('noDefaults')
    })
  })

  describe('parser', function() {
    let schema = new Schema({
      test: true
    })

    describe('function String', function() {
      let result = schema._parse({ val: String })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('function Number', function() {
      let result = schema._parse({ val: Number })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('function Date', function() {
      let result = schema._parse({ val: Date })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('function Array', function() {
      let result = schema._parse({ val: Array })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('function Object', function() {
      let result = schema._parse({ val: Object })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('function Function', function() {
      let result = schema._parse({ val: Function })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal String', function() {
      let result = schema._parse({ val: '' })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal Number', function() {
      let result = schema._parse({ val: 0 })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal Date', function() {
      let result = schema._parse({ val: new Date() })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal Array', function() {
      let result = schema._parse({ val: [] })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal Object', function() {
      let result = schema._parse({ val: {} })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal Function', function() {
      let result = schema._parse({ val: function() {} })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed String', function() {
      let result = schema._parse({ val: { type: String } })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed Number', function() {
      let result = schema._parse({ val: { type: Number } })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed Date', function() {
      let result = schema._parse({ val: { type: Date } })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed Array', function() {
      let result = schema._parse({ val: { type: Array } })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed Object', function() {
      let result = schema._parse({ val: { type: Object } })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed Function', function() {
      let result = schema._parse({ val: { type: Function } })
      it('create a Joi schema', function() {
        expect(result.isJoi).to.be.true
      })
    })
  })

  describe('attribute parser', function() {
    let schema = new Schema({
      test: true
    })

    describe('invalid attribute', function() {
      it('throw an error', function() {
        let fn = function() {
          schema._parseAttrs(
            'name',
            Joi.number(),
            {
              name: {
                type: String,
                bogus: true
              }
            },
            function() {}
          )
        }
        expect(fn).to.throw('Invalid attribute')
      })
    })

    describe('valid attribute', function() {
      it('not throw error', function() {
        let fn = function() {
          schema._parseAttrs(
            'name',
            Joi.number(),
            {
              name: {
                type: String,
                default: ''
              }
            },
            function() {}
          )
        }
        expect(fn).to.not.throw('Invalid attribute')
      })
    })
  })

  describe('default attribute', function() {
    let schema = new Schema({
      test: true
    })

    it('create a default property', function() {
      let result = schema._createDefaultObject({
        name: {
          type: String,
          default: 'hi'
        }
      })
      expect(result).to.has.property('name')
    })

    it('have a default value', function() {
      let result = schema._createDefaultObject({
        name: {
          type: String,
          default: 'hi'
        }
      })
      expect(result.name).to.equal('hi')
    })
  })

  describe('validation', function() {
    let schema = new Schema({
      name: String
    })

    describe('valid data', function() {
      it('should pass', async function() {
        let result = await schema.validate({
          name: 'Rob'
        })
        expect(result).to.deep.equal({ name: 'Rob' })
      })
    })

    describe('invalid data', function() {
      it('should fail', function() {
        let result
        schema.validate(
          {
            name: 0
          },
          function(data) {
            result = data
          }
        )
        expect(result).to.be.an.instanceof(Error)
      })
    })
  })
})
