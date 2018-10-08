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

schema.statics.login = async function(username, password) {
  const User = orango.model('User')
  const UserRole = orango.model('UserRole')
  return await this.findOne({ username, password })
    .populate('user', User.findById('@@parent._key')
      .populate('permissions', UserRole.findById('@@parent.role || "user"').select('permissions'), { merge: true })
      .select('_key email firstName lastName role'))
    .select('user')
    .each((authUser) => {
      let user = authUser.user
      user.id = user._key
      delete user._key
      delete user._id
      return user
    })
}

schema.statics.getUser = async function(id) {
  const User = orango.model('User')
  const UserRole = orango.model('UserRole')
  return await User.findById(id)
    .populate('permissions', UserRole.findById('@@parent.role || "user"').select('permissions'), { merge: true })
    .select('_key email firstName lastName role')
    .each((user) => {
      user.id = user._key
      user.fullName = user.firstName + ' ' + user.lastName
      delete user._key
      delete user._id
      return user
    })
}

module.exports = orango.model('Auth', schema)