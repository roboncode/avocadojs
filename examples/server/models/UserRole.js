const orango = require('orango')

let schema = orango.Schema({
  permissions: String
})

module.exports = orango.model('UserRole', schema)
