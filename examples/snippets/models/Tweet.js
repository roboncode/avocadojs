const orango = require('../../../lib')

let schema = orango.Schema(
  {
    user: String,
    text: { type: String, max: 140 },
    stats: {
      likes: { type: orango.Types.Any, default: 0 },
      comments: { type: orango.Types.Any, default: 0 }
    },
    created: { type: Date }
  },
  {
    strict: true,
    indexes: [
      {
        type: 'hash',
        fields: [ 'user' ]
      },
      {
        type: 'hash',
        fields: [ 'created' ]
      },
      {
        type: 'hash',
        fields: [ 'likes' ]
      }
    ]
  }
)

module.exports = orango.model('Tweet', schema)

