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

  _parse(json) {
    if (json.schema) {
      return json.schema.joi
    }

    let joiSchema = {}
    for (let prop in json) {
      if (json.hasOwnProperty(prop)) {
        joiSchema[prop] = this._parseItem(prop, joiSchema, json[prop])
      }
    }
    return Joi.object(joiSchema)
  }

  _parseItem(prop, joiSchema, jsonSchemaItem) {
    let type = this._parseType(jsonSchemaItem)
    console.log('type2'.bgCyan, prop, type)
    let defaultObject

    if (type === 'joi') {
      return jsonSchemaItem
    }

    let joiItem = Joi[type]()

    if (type === 'object') {
      // if any children have a default property...
      if (JSONstringify(jsonSchemaItem).match(/"default":/gi)) {
        defaultObject = this._createDefaultObject(jsonSchemaItem)
        joiItem = this._parse(jsonSchemaItem)
        joiItem = joiItem.default(defaultObject)
      }
    } else if (type === 'array') {
      let joiSchemArray = {}
      if (jsonSchemaItem.length > 1) {
        throw new Error('Array cannot contain more than one schema')
      } else if (jsonSchemaItem.length === 0) {
        joiItem = Joi.array().items(Joi.any())
      } else {
        joiItem = Joi.array().items(this._parseItem(0, joiSchemArray, jsonSchemaItem[0]))
      }
    } else {
      this._parseAttrs(prop, joiSchema, jsonSchemaItem, val => {
        joiSchema[prop] = val
      })
    }
    return joiItem
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
        console.log('type'.bgBlue, type)
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
  Id: Joi.any(), // TODO: Do something here, not sure what
  Any: Joi.any(),
  Mixed: Joi.any()
}

module.exports = Schema