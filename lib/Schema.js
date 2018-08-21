const tang = require('../tang')

class ArangoSchema extends tang.Schema {
  constructor(jsonSchema, options = {}) {
    jsonSchema._key = String
    super(jsonSchema, options)
  }
}

module.exports = ArangoSchema
