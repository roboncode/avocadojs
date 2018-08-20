const avocado = require('../avocado')

class ArangoSchema extends avocado.Schema {
  constructor(jsonSchema, options = {}) {
    jsonSchema._key = String
    super(jsonSchema, options)
  }
}

module.exports = ArangoSchema
