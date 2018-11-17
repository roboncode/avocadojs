const orango = require('../../lib')

const UserSchema = orango.Schema({
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
}, {
  strict: true,
  indexes: [{
    type: 'hash',
    fields: ['email']
  }]
})

const User = orango.model('User', UserSchema, 'users')

User.on('create', (payload) => {
  payload.data.created = Date.now()
})

User.on('update', (payload) => {
  payload.data.updated = Date.now()
})

module.exports = User
