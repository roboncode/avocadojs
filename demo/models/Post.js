const arango = require('../../arango')

let schema = arango.Schema({
  title: String,
  content: String
})
module.exports = arango.model('Post', schema)