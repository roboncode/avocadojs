const User = (orango) => {
  const UserSchema = orango.Schema({
    name: String,
    email: {
      type: String,
      required: 'create'
    },
    settings: {
      locale: {
        type: String,
        default: 'en_US'
      }
    },
    stats: {
      friends: {
        type: orango.Types.Any,
        default: 0
      },
      posts: {
        type: orango.Types.Any,
        default: 0
      }
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

  UserSchema.computed.username = function (payload) {
    return this.email.replace(/(\w+)@(\w+).*/g, '$1_$2')
  }

  const UserModel = orango.model('User', UserSchema, 'users')

  UserModel.on('create', (payload) => {
    payload.data.created = Date.now()
  })

  UserModel.on('update', (payload) => {
    payload.data.updated = Date.now()
  })

  return UserModel
}


module.exports = User