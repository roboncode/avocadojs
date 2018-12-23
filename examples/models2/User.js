const orango = require('../../../lib')

const UserSchema = orango.Schema(
  {
    name: String,
    email: { type: String, required: 'create' },
    settings: {
      locale: {
        type: String,
        default: 'en_US'
      }
    },
    stats: {
      friends: { type: orango.Types.Any, default: 0 },
      posts: { type: orango.Types.Any, default: 0 }
    },
    created: Date,
    updated: Date
  },
  {
    strict: true,
    indexes: [
      {
        type: 'hash',
        fields: [ 'email' ]
      }
    ]
  }
)

// UserSchema.computed.username = function(payload) {
//   return this.email.replace(/(\w+)@(\w+).*/g, '$1_$2')
// }

UserSchema.computed.message = function() {
  return 'Hello, world!'
}

const User = orango.model('User', UserSchema, 'users')

User.hasMany('Tweet')

User.on('create', (payload) => {
  payload.data.created = Date.now()
})

User.on('update', (payload) => {
  payload.data.updated = Date.now()
})

module.exports = User
