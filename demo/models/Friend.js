const arango = require('../../arango/Arango').getInstance()

let schema = arango.createSchema({
  user: String,
  friend: String,
  tags: [String]
})

module.exports = arango.model('Friend', schema)
