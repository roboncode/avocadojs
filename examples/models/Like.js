/**
 * Schemas are a JSON representation of Joi schemas. You can use 
 * Joi within the JSON to handle custom definitions. You will see
 * that almost everythin can be handles via JSON.
 */
const orango = require('../../lib')

let schema = orango.Schema(
  {
    _from: String,
    _to: String
  },
  { edge: true }
)

module.exports = orango.model('Like', schema)
