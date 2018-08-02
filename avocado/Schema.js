const Joi = require('joi')
const getObjectKeys = require('./helpers/getObjectKeys')

class Schema {
  constructor(jsonSchema, options = {}) {
    this._schema = jsonSchema
    this._options = options
    this._joiSchema = this._parse(jsonSchema)
    this._schemaKeys = getObjectKeys(jsonSchema)

    this.statics = {}
    this.methods = {}
    this.computed = {}
  }

  get options() {
    return this._options
  }

  getSchemaKeys() {
    return this._schemaKeys
  }

  getJSON() {
    return this._schema
  }

  getJoi() {
    return this._joiSchema
  }

  validate(data, options) {
    return this._joiSchema.validate(data, options)
  }

  _error(e) {
    console.error('Error', e.message)
  }

  _parse(jsonSchema) {
    let joiSchema = {}
    for (let prop in jsonSchema) {
      if (jsonSchema.hasOwnProperty(prop)) {
        let jsonSchemaItem = jsonSchema[prop]
        let type = this._parseType(jsonSchemaItem)
        let defaultObject
        joiSchema[prop] = Joi[type]()

        if (type === 'object') {
          if (JSON.stringify(jsonSchemaItem).match(/"default":/gi)) {
            defaultObject = this._createDefaultObject(jsonSchemaItem)
            joiSchema[prop] = this._parse(jsonSchemaItem)
            joiSchema[prop] = joiSchema[prop].default(defaultObject)
          }
        } else if (type === 'array') {
          joiSchema[prop] = Joi.array()
          if (jsonSchemaItem.length) {
            joiSchema[prop] = joiSchema[prop].items(
              this._parse(jsonSchemaItem[0])
            )
          }
        } else {
          this._parseAttrs(prop, joiSchema, jsonSchemaItem, val => {
            joiSchema[prop] = val
          })
        }
      }
    }
    return Joi.object(joiSchema)
  }

  _parseType(item) {
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
  Any: Object,
  Mixed: Object
}

module.exports = Schema