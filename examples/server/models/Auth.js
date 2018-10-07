const orango = require('orango')

let schema = orango.Schema(
  {
    username: String,
    password: String
  },
  {
    strict: true,
    indexes: [
      {
        type: 'hash',
        fields: ['username', 'password']
      }
    ]
  }
)

module.exports = orango.model('Auth', schema)
