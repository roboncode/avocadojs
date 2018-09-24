const orango = require('orango')

let schema = orango.Schema(
  {
    role: { type: String, valid: ['admin', 'user'], default: 'user' },
    screenName: String, // roboncode
    firstName: { type: String, regex: /^[A-Za-z\s']+$/, min: 3 },
    lastName: String,
    email: { type: String, email: {} },
    stats: {
      posts: {
        type: orango.Types.Any,
        default: 0
      }
    },
    settings: {
      lang: { type: String, default: 'en-us' },
      timezone: { type: Number, default: -18000 }
    },
    createdAt: Date,
    updatedAt: { type: Date, default: Date.now }
  },
  {
    strict: true,
    removeOnMatchDefault: true,
    indexes: [
      {
        type: 'hash',
        fields: ['authId']
      },
      {
        type: 'hash',
        fields: ['email']
      },
      {
        type: 'hash',
        fields: ['screenName']
      },
      {
        type: 'skipList',
        fields: ['screenName']
      },
      {
        type: 'skipList',
        fields: ['firstName']
      },
      {
        type: 'skipList',
        fields: ['lastName']
      }
    ]
  }
)

schema.computed.fullName = function() {
  return this.firstName + ' ' + this.lastName
}

module.exports = orango.model('User', schema, 'users')
