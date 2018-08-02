const arango = require('../../arango')

let schema = arango.createSchema({
  user: String,
  friend: String,
  tags: [String]
})

module.exports = arango.model('Friend', schema)
