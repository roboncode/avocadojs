let expect = require('chai').expect
let Schema = require('../tang/Schema')
let Joi = require('joi')

describe('tang schema', () => {
  describe('empty schema', () => {
    it('throw an error', () => {
      let emptySchema = function() {
        new Schema()
      }
      expect(emptySchema).to.throw('object')
    })
  })

  describe('schema type parser', () => {
    describe('function types', () => {
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

      describe('String', () => {
        it('to be type "string"', () => {
          expect(schema._parseType(dataTypes.str)).to.equal('string')
        })
      })

      describe('Number', () => {
        it('to be type "number"', () => {
          expect(schema._parseType(dataTypes.num)).to.equal('number')
        })
      })

      describe('Boolean', () => {
        it('to be type "boolean"', () => {
          expect(schema._parseType(dataTypes.bool)).to.equal('boolean')
        })
      })

      describe('Date', () => {
        it('to be type "date"', () => {
          expect(schema._parseType(dataTypes.date)).to.equal('date')
        })
      })

      describe('Array', () => {
        it('to be type "array"', () => {
          expect(schema._parseType(dataTypes.arr)).to.equal('array')
        })
      })

      describe('Object', () => {
        it('to be type "object"', () => {
          expect(schema._parseType(dataTypes.obj)).to.equal('object')
        })
      })

      describe('Function', () => {
        it('to be type "func"', () => {
          expect(schema._parseType(dataTypes.fn)).to.equal('func')
        })
      })

      describe('Joi', () => {
        it('to be type "joi"', () => {
          expect(schema._parseType(dataTypes.joi)).to.equal('joi')
        })
      })

      describe('Schema', () => {
        it('to be type "schema"', () => {
          expect(schema._parseType(dataTypes.schema)).to.equal('schema')
        })
      })

      describe('undefined', () => {
        it('to be type "undefined"', () => {
          let fn = () => {
            schema._parseType()
          }
          expect(fn).to.throw('cannot')
        })
      })
    })

    describe('"type" types', () => {
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

      describe('String', () => {
        it('to be type "string"', () => {
          expect(schema._parseType(dataTypes.str)).to.equal('string')
        })
      })

      describe('Number', () => {
        it('to be type "number"', () => {
          expect(schema._parseType(dataTypes.num)).to.equal('number')
        })
      })

      describe('Boolean', () => {
        it('to be type "boolean"', () => {
          expect(schema._parseType(dataTypes.bool)).to.equal('boolean')
        })
      })

      describe('Date', () => {
        it('to be type "date"', () => {
          expect(schema._parseType(dataTypes.date)).to.equal('date')
        })
      })

      describe('Array', () => {
        it('to be type "array"', () => {
          expect(schema._parseType(dataTypes.arr)).to.equal('array')
        })
      })

      describe('Object', () => {
        it('to be type "object"', () => {
          expect(schema._parseType(dataTypes.obj)).to.equal('object')
        })
      })

      describe('Function', () => {
        it('to be type "func"', () => {
          expect(schema._parseType(dataTypes.fn)).to.equal('func')
        })
      })

      describe('any unrecognized type', () => {
        it('to be type "object"', () => {
          expect(schema._parseType(dataTypes.any)).to.equal('object')
        })
      })
    })

    describe('literal types', () => {
      let dataTypes = {
        str: '',
        num: 1,
        bool: true,
        date: new Date(),
        arr: [],
        obj: {},
        fn: () => {}
      }
      let schema = new Schema({
        test: true
      })

      describe('String', () => {
        it('to be type "string"', () => {
          expect(schema._parseType(dataTypes.str)).to.equal('string')
        })
      })

      describe('Number', () => {
        it('to be type "number"', () => {
          expect(schema._parseType(dataTypes.num)).to.equal('number')
        })
      })

      describe('Boolean', () => {
        it('to be type "boolean"', () => {
          expect(schema._parseType(dataTypes.bool)).to.equal('boolean')
        })
      })

      describe('Date', () => {
        it('to be type "date"', () => {
          expect(schema._parseType(dataTypes.date)).to.equal('date')
        })
      })

      describe('Array', () => {
        it('to be type "array"', () => {
          expect(schema._parseType(dataTypes.arr)).to.equal('array')
        })
      })

      describe('Object', () => {
        it('to be type "object"', () => {
          expect(schema._parseType(dataTypes.obj)).to.equal('object')
        })
      })

      describe('Function', () => {
        it('to be type "func"', () => {
          expect(schema._parseType(dataTypes.fn)).to.equal('func')
        })
      })
    })
  })

  describe('single key/value schema', () => {
    let json = {
      name: String
    }
    let schema = new Schema(json, {
      noDefaults: true
    })

    it('to be schema', () => {
      expect(schema.isSchema).to.be.true
    })

    it('to keep reference to source', () => {
      expect(schema.json).to.equal(json)
    })

    it('to have a joi version of schema', () => {
      expect(schema.joi.isJoi).to.be.true
    })

    // it('to have schema key "name"', () => {
    //   expect(schema.schemaKeys).to.have.all.members(['name'])
    // })

    it('to have options with key "noDefaults"', () => {
      expect(schema.options).to.have.all.keys('noDefaults')
    })
  })

  describe('parser', () => {
    let schema = new Schema({
      test: true
    })

    describe('function String', () => {
      let result = schema._parse({ val: String })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('function Number', () => {
      let result = schema._parse({ val: Number })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('function Date', () => {
      let result = schema._parse({ val: Date })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('function Array', () => {
      let result = schema._parse({ val: Array })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('function Object', () => {
      let result = schema._parse({ val: Object })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('function Function', () => {
      let result = schema._parse({ val: Function })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal String', () => {
      let result = schema._parse({ val: '' })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal Number', () => {
      let result = schema._parse({ val: 0 })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal Date', () => {
      let result = schema._parse({ val: new Date() })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal Array', () => {
      let result = schema._parse({ val: [] })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal Object', () => {
      let result = schema._parse({ val: {} })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('literal Function', () => {
      let result = schema._parse({ val: () => {} })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed String', () => {
      let result = schema._parse({ val: { type: String } })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed Number', () => {
      let result = schema._parse({ val: { type: Number } })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed Date', () => {
      let result = schema._parse({ val: { type: Date } })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed Array', () => {
      let result = schema._parse({ val: { type: Array } })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed Object', () => {
      let result = schema._parse({ val: { type: Object } })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })

    describe('typed Function', () => {
      let result = schema._parse({ val: { type: Function } })
      it('create a Joi schema', () => {
        expect(result.isJoi).to.be.true
      })
    })
  })

  describe('attribute parser', () => {
    let schema = new Schema({
      test: true
    })

    describe('invalid attribute', () => {
      it('throw an error', () => {
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
            () => {}
          )
        }
        expect(fn).to.throw('Invalid attribute')
      })
    })

    describe('valid attribute', () => {
      it('not throw error', () => {
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
            () => {}
          )
        }
        expect(fn).to.not.throw('Invalid attribute')
      })
    })
  })

  describe('default attribute', () => {
    let schema = new Schema({
      test: true
    })

    it('create a default property', () => {
      let result = schema._createDefaultObject({
        name: {
          type: String,
          default: 'hi'
        }
      })
      expect(result).to.has.property('name')
    })

    it('have a default value', () => {
      let result = schema._createDefaultObject({
        name: {
          type: String,
          default: 'hi'
        }
      })
      expect(result.name).to.equal('hi')
    })
  })

  describe('validation', () => {
    let schema = new Schema({
      name: String
    })

    describe('valid data', () => {
      it('should pass', async () => {
        let result = await schema.validate({
          name: 'Rob'
        })
        expect(result).to.deep.equal({ name: 'Rob' })
      })
    })

    describe('invalid data', () => {
      it('should fail', () => {
        let result
        schema.validate(
          {
            name: 0
          },
          data => {
            result = data
          }
        )
        expect(result).to.be.an.instanceof(Error)
      })
    })
  })
})
