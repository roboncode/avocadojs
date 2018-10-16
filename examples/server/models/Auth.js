const orango = require('orango')
const bcrypt = require('bcrypt')
const human = require('humanparser')
const config = require('../config')

let schema = orango.Schema({
  username: String,
  passwordHash: String,
  created: Date
}, {
  strict: true,
  indexes: [{
    type: 'hash',
    fields: ['username']
  }]
})

schema.statics.signup = async function (username, password, name) {
  let authUser = await this.findOne({
    username
  }).id()

  if (authUser) {
    throw new Error('User exists')
  }

  // create authUser
  authUser = new this()
  authUser.username = username
  authUser.created = Date.now()
  authUser.passwordHash = bcrypt.hashSync(
    password + authUser.created,
    config.SALT_ROUNDS
  )
  await authUser.save()

  // create User
  const attrs = human.parseName(name)
  const User = orango.model('User')
  let user = new User({
    firstName: attrs.firstName,
    lastName: attrs.lastName,
    email: username,
    screenName: username.replace(/(@\w+\.\w+)/gi, "").replace(/[._+]/gi, ""),
    created: Date.now()
  })
  await user.save()
  return user
}

schema.statics.login = async function (username, password) {
  let authUser = await this.findOne({
    username
  }).id()
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

schema.statics.getUser = async function (id, options = {}) {
  const User = orango.model('User')
  const UserRole = orango.model('UserRole')
  return await User.findById(id)
    .id()
    .defaults(options.defaults)
    .populate('permissions', UserRole.findById('@@parent.role || "user"').select('permissions'), {
      merge: true
    })
}

module.exports = orango.model('Auth', schema)