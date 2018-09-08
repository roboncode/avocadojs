const orango = require('orango')

let schema = orango.Schema(
  {
    user: String,
    title: String,
    content: String
  },
  {
    strict: true
  }
)
module.exports = orango.model('Post', schema)
