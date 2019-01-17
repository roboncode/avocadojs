const EventEmitter = require('events')
const tang = require('tangjs')
const createDefaultTree = require('./helpers/createDefaultTree')
const parseArrayPaths = require('./helpers/parseArrayPaths')
const Joi = require('joi')

class Schema extends EventEmitter {
  constructor(json, options = {}) {
    super()

    // ensure _key is a property available to all schemas
    json._key = String
    if (options.type === 'edge') {
      json._to = String
      json._from = String
    }
    // this.validator = new tang.Schema(json, options)
    this.options = Object.assign({ strict: true, indexes: [] }, options)

    // default data represents arrays
    this._defaultData = createDefaultTree(json)
    // array paths are used to quickly look up arrays instead of parsing entire tree each time
    this._arrayPaths = parseArrayPaths(this._defaultData)
    // console.log('options', this.options)

    this.validator = new tang.Schema(json, this.options)
  }

  addIndex(type, fields) {
    if (typeof fields === 'string') {
      fields = [fields]
    }
    this.options.indexes.push({ type, fields })
  }

  strict(val = true) {
    this.options.strict = val
  }

  validate(data, options) {
    return this.validator.validate(data, options)
  }
}

Schema.Types = tang.Schema.Types
Schema.Types.Array = Joi.alternatives().try(
  Joi.array(),
  Joi.string()
    .trim()
    .regex(/@{(.+?)}/)
    .error(new Error('Must be an Orango expression @{...}'))
)

module.exports = Schema
