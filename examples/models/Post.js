/**
 * Schemas are a JSON representation of Joi schemas. You can use 
 * Joi within the JSON to handle custom definitions. You will see
 * that almost everythin can be handles via JSON.
 */
const orango = require('../../lib')

let schema = orango.Schema({
  title: String,
  content: String
}, {
  strict: true
})
module.exports = orango.model('Post', schema)