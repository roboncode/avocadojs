const tang = require('tangjs')
const Joi = require('joi')

const isEmpty = require('./helpers/isEmpty')

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
    this.insertDefaults = {}
    this.updateDefaults = {}
    this.createDefaultTree(json, this.insertDefaults, this.updateDefaults)

    this._validator = new tang.Schema(json, this.options)
  }

  createDefaultTree(jsonSchema, insertDefaults, updateDefaults) {
    const orango = this.orango
    for (let prop in jsonSchema) {
      if (jsonSchema.hasOwnProperty(prop)) {
        if (typeof jsonSchema[prop] === 'string') {
          let modelName = jsonSchema[prop]
          let model = orango.model(modelName)
          jsonSchema[prop] = model.schema.getJSON()
          insertDefaults[prop] = model.schema.insertDefaults
          updateDefaults[prop] = model.schema.updateDefaults
          this.struct[prop] = modelName
        }
        // if the prop is an object
        else if (typeof jsonSchema[prop] === 'object') {
          if (jsonSchema[prop] instanceof Array) {
            insertDefaults[prop] = []
          }
          // prop expected to have type and not be Joi
          else if (jsonSchema[prop].hasOwnProperty('type')) {
            // if "default"
            if (jsonSchema[prop].default) {
              insertDefaults[prop] = jsonSchema[prop].default
              delete jsonSchema[prop].default
            }

            // if "defaultOnUpdate"
            if (jsonSchema[prop].defaultOnUpdate) {
              updateDefaults[prop] = jsonSchema[prop].defaultOnUpdate
              delete jsonSchema[prop].defaultOnUpdate
            }
          }
          // to not parse if Joi
          else if (!jsonSchema[prop].isJoi) {
            let insertData = {}
            let updateData = {}
            this.createDefaultTree(jsonSchema[prop], insertData, updateData)
            if (!isEmpty(insertData)) {
              this.insertDefaults[prop] = insertData
            }
            if (!isEmpty(updateData)) {
              this.updateDefaults[prop] = updateData
            }
          } 
          // props that are not parsed
          // else {
          //   console.log('PROP'.red, prop)
          // }
        }
      }
    }
  }

  _preparser(jsonSchema) {
    const orango = this.orango
    this.insertDefaults = {}
    this.updateDefaults = {}
    for (let n in jsonSchema) {
      if (jsonSchema.hasOwnProperty(n)) {
        if (typeof jsonSchema[n] === 'string') {
          let modelName = jsonSchema[n]
          // console.log('whois', orango.model(modelName).schema.getJSON())
          jsonSchema[n] = orango.model(modelName).schema.getJSON()
          // jsonSchema[n] = Joi.lazy(() => {
          //   return orango.model(modelName).schema.getJoi()
          // })
          this.struct[n] = modelName
        }

        if (jsonSchema[n].default && !jsonSchema[n].isJoi) {
          this.insertDefaults[n] = jsonSchema[n].default
          delete jsonSchema[n].default
        }

        if (jsonSchema[n].defaultOnUpdate) {
          this.updateDefaults[n] = jsonSchema[n].defaultOnUpdate
          delete jsonSchema[n].defaultOnUpdate
        }
      }
    }
  }

  deepCopy(obj) {
    var clone = {}
    for (var i in obj) {
      if (obj[i] !== null && typeof obj[i] === 'object') {
        clone[i] = this.deepCopy(obj[i])
      } else {
        clone[i] = obj[i]
      }
    }
    return clone
  }

  getJSON() {
    return this.deepCopy(this._json)
  }

  getJoi() {
    return this._validator.joi
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
    return this._validator.validate(data, options)
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
