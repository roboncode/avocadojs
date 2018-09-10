const orango = require('orango')

let schema = orango.Schema(
  {
    user: String,
    title: String,
    content: String
  },
  {
    strict: true,
    indexes: [
      {
        type: 'hash',
        fields: ['user']
      }
    ]
  }
)

module.exports = orango.model('Post', schema)
