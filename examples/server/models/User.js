const orango = require('orango')

let schema = orango.Schema(
  {
    authId: String,
    role: { type: String, valid: ['admin', 'user'], default: 'user' },
    permissions: String, // will be populated
    screenName: String, // roboncode
    firstName: String,
    lastName: String,
    avatar: String, // URL to avatar image
    desc: String,
    settings: {
      banner: String, // URL to background image
      theme: String, // #FF0000,
      lang: { type: String, default: 'en-us' },
      timezone: { type: Number, default: -18000 }
    },
    stats: {
      following: {
        type: orango.Types.Any,
        default: 0
      },
      followers: {
        type: orango.Types.Any,
        default: 0
      },
      tweets: {
        type: orango.Types.Any,
        default: 0
      }
      ,
      likes: {
        type: orango.Types.Any,
        default: 0
      }
    },
    created: Date,
    updated: { type: Date, default: Date.now }
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

// schema.statics.getUser = async function(user) {
//   return this.get
// }

schema.computed.fullName = function() {
  return this.firstName + ' ' + this.lastName
}

module.exports = orango.model('User', schema, 'users')
