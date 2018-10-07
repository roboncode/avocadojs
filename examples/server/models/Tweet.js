const orango = require('orango')

let schema = orango.Schema(
  {
    user: String,
    text: { type: String, max: 140 },
    likes: { type: orango.Types.Any, default: 0 }
  },
  {
    strict: true,
    indexes: [
      {
        type: 'hash',
        fields: ['user']
      },
      {
        type: 'hash',
        fields: ['likes']
      }
    ]
  }
)
module.exports = orango.model('Tweet', schema)
