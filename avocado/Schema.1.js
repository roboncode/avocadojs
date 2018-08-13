const Joi = require('joi')
const getObjectKeys = require('./helpers/getObjectKeys')
const JSONstringify = require('./helpers/jsonStringify')
require('colors')

class Schema {
  constructor(json, options = {}) {
    this._json = json
    this._options = options
    this._joi = this._parse(json)
    this._schemaKeys = getObjectKeys(json)
    this.isSchema = true

    this.statics = {}
    this.methods = {}
    this.computed = {}
  }

  get options() {
    return this._options
  }

  get schemaKeys() {
    return this._schemaKeys
  }

  get json() {
    return this._json
  }

  get joi() {
    return this._joi
  }

  validate(data, options) {
    return this._joi.validate(data, options)
  }

  _error(e) {
    console.error('Error', e.message)
  }

  _parse(data) {
    if (data.schema) {
      return data.schema.joi
    }

    let joiSchema = {}
    for (let prop in data) {
      if (data.hasOwnProperty(prop)) {
        let item = data[prop]
        let type = this._parseType(item)

        if (type === 'joi') {
          return item
        }

        joiSchema[prop] = Joi[type]()

        if (type === 'object') {
          // if any children have a default property...
          if (JSONstringify(item).match(/"default":/gi)) {
            let defaultObject = this._createDefaultObject(item)
            joiSchema[prop] = this._parse(item)
            joiSchema[prop] = joiSchema[prop].default(defaultObject)
          }
        } else if (type === 'array') {
          joiSchema[prop] = Joi.array()
          if (item.length) {
            joiSchema[prop] = joiSchema[prop].items(
              this._parse(item[0])
            )
          }
        } else {
          this._parseAttrs(prop, joiSchema, item, val => {
            joiSchema[prop] = val
          })
        }
      }
    }
    return Joi.object(joiSchema)
  }

  _parseType(item) {

    if (item.isSchema) {
      return 'schema'
    }

    if (item.isJoi) {
      return 'joi'
    }

    let type = typeof item
    if (type.type) {
      type = type.type
    }
    switch (type) {
      case 'object':
        type = item.type
        if (type === String) {
          return 'string'
        }
        if (type === Number) {
          return 'number'
        }
        if (type === Boolean) {
          return 'number'
        }
        if (type === Date) {
          return 'date'
        }
        if (item instanceof Array) {
          return 'array'
        }
        if (item instanceof Object) {
          return 'object'
        }
        break
      case 'function':
        if (item === String) {
          return 'string'
        }
        if (item === Number) {
          return 'number'
        }
        if (item === Boolean) {
          return 'number'
        }
        if (item === Date) {
          return 'date'
        }
        return 'func'
        break
      default:
        return type
    }
  }

  _parseAttrs(prop, joiSchema, jsonSchemaItem, callback) {
    if (typeof jsonSchemaItem !== 'function') {
      let item = jsonSchemaItem
      for (let attr in item) {
        if (attr !== 'type') {
          // do not parse type
          let val = item[attr]
          try {
            if (typeof val === 'function') {
              joiSchema[prop] = joiSchema[prop][attr](
                val,
                `default function() for ${prop}`
              )
            } else {
              joiSchema[prop] = joiSchema[prop][attr](val)
            }
          } catch (e) {
            this._error(e)
          }
        }
      }
    }
    callback(joiSchema[prop])
  }

  _createDefaultObject(jsonSchemaItem) {
    let defaultObject = {}
    for (let prop in jsonSchemaItem) {
      if (jsonSchemaItem[prop].hasOwnProperty('default')) {
        defaultObject[prop] = jsonSchemaItem[prop].default
      } else {
        let type = this._parseType(jsonSchemaItem[prop])
        if (type === 'object') {
          defaultObject[prop] = this._createDefaultObject(jsonSchemaItem[prop])
        }
      }
    }
    return defaultObject
  }
}

Schema.Types = {
  String,
  Number,
  Boolean,
  Object,
  Array,
  Date,
  RegExp,
  Any: Joi.any(),
  Mixed: Joi.any()
}

module.exports = Schema