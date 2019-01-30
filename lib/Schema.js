// const EventEmitter = require('events')
const tang = require('tangjs')
const createDefaultTree = require('./helpers/createDefaultTree')
// const parseArrayPaths = require('./helpers/parseArrayPaths')
const Joi = require('joi')

class Schema {
  constructor(json = {}, options = {}) {
    this._json = json
    this.options = Object.assign({ strict: true, indexes: [] }, options)
    this.struct = {}
  }

  init(orango) {
    this.orango = orango
    let json = this._json
    // ensure _key is a property available to all schemas
    json._key = String

    // default data represents arrays
    this._defaultData = createDefaultTree(json)
    // array paths are used to quickly look up arrays instead of parsing entire tree each time
    // TODO: Deprecated
    // this._arrayPaths = parseArrayPaths(this._defaultData)
    // console.log('options', this.options)

    this._preparser(json)

    this.validator = new tang.Schema(json, this.options)
  }

  _preparser(json) {
    this.insertDefaults = {}
    this.updateDefaults = {}
    for (let n in json) {
      if (json.hasOwnProperty(n)) {
        if (typeof json[n] === 'string') {
          let modelName = json[n]
          json[n] = Joi.lazy(() => {
            return orango.model(modelName).schema.joi
          })
          this.struct[n] = modelName
        }

        if (json[n].default && !json[n].isJoi) {
          this.insertDefaults[n] = json[n].default
          delete json[n].default
        }

        if (json[n].defaultOnUpdate) {
          this.updateDefaults[n] = json[n].defaultOnUpdate
          delete json[n].defaultOnUpdate
        }
      }
    }
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

  type(val = 'doc', options = {}) {
    let json = this._json
    if (val === 'edge') {
      json._to = String
      json._from = String
    }
    Object.assign(this.options, options)
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
