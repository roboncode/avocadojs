const tang = require('tangjs')
const createDefaultTree = require('./helpers/createDefaultTree')
const parseArrayPaths = require('./helpers/parseArrayPaths')
const Joi = require('joi')

class OrangoSchema extends tang.Schema {
  constructor(jsonSchema = {}, options = {}) {
    // ensure _key is a property available to all schemas
    jsonSchema._key = String
    if (options.type === 'edge') {
      jsonSchema._to = String
      jsonSchema._from = String
    }
    super(jsonSchema, options)
    // default data represents arrays
    this._defaultData = createDefaultTree(jsonSchema)
    // array paths are used to quickly look up arrays instead of parsing entire tree each time
    this._arrayPaths = parseArrayPaths(this._defaultData)
  }
}

OrangoSchema.Types.Array = Joi.alternatives().try(
  Joi.array(),
  Joi.string()
    .trim()
    .regex(/@{(.+?)}/)
    .error(new Error('Must be an Orango expression @{...}'))
)

module.exports = OrangoSchema
