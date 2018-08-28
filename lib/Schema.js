const tang = require('../tang')
const createDefaultTree = require('./helpers/createDefaultTree')
const parseArrayPaths = require('./helpers/parseArrayPaths')

class ArangoSchema extends tang.Schema {
  constructor(jsonSchema, options = {}) {
    jsonSchema._key = String
    super(jsonSchema, options)
    // default data represents arrays
    this._defaultData = createDefaultTree(jsonSchema)
    // array paths are used to quickly look up arrays instead of parsing entire tree each time
    this._arrayPaths = parseArrayPaths(this._defaultData)
  }
}

module.exports = ArangoSchema
