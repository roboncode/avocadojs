const orango = require('../../orango')

let schema = orango.Schema({
  title: String,
  content: String
}, {
  strict: true
})
module.exports = orango.model('Post', schema)