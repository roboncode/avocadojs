const orango = require('orango')
const bcrypt = require('bcrypt')

let schema = orango.Schema(
  {
    username: String,
    passwordHash: String,
    created: Date
  },
  {
    strict: true,
    indexes: [
      {
        type: 'hash',
        fields: ['username']
      }
    ]
  }
)

schema.statics.login = async function (username, password) {
  let authUser = await this.findOne({ username }).id()
  if (authUser) {
    const timestamp = new Date(authUser.created).getTime()
    const isMatch = await bcrypt.compare(password + timestamp, authUser.passwordHash)
    if (isMatch) {
       return await this.getUser(authUser.id, {
         select: '_key email firstName lastName role'
       })
    }
  }
}

schema.statics.getUser = async function(id, options = {}) {
  const User = orango.model('User')
  const UserRole = orango.model('UserRole')
  return await User.findById(id)
    .id()
    .defaults(options.defaults)
    .populate('permissions', UserRole.findById('@@parent.role || "user"').select('permissions'), { merge: true })
}

module.exports = orango.model('Auth', schema)