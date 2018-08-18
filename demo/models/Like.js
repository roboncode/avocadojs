const arango = require('../../arango')

let schema = arango.Schema({
  _from: String,
  _to: String
}, { edge: true })
module.exports = arango.model('Like', schema)
