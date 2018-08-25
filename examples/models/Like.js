const orango = require('../../lib')

let schema = orango.Schema({
  _from: String,
  _to: String
}, { edge: true })
module.exports = orango.model('Like', schema)
