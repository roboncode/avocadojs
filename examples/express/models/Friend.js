const orango = require('orango')

let schema = orango.Schema({
  user: String,
  friend: String,
  tags: [String]
})

module.exports = orango.model('Friend', schema)