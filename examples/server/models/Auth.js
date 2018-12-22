const orango = require('orango')
const bcrypt = require('bcrypt')
const config = require('../config')
const CONSTS = require('../consts')

let schema = orango.Schema({
  provider: {
    type: String,
    required: true,
    allow: [CONSTS.AUTH_PROVIDERS.EMAIL, CONSTS.AUTH_PROVIDERS.PHONE]
  },
  identifier: {
    type: String,
    required: true
  },
  passwordHash: String,
  created: Date,
  signedIn: Date
}, {
  strict: true,
  indexes: [{
    type: 'hash',
    fields: ['username']
  }]
})

schema.statics.signupByEmail = async function (email, password) {

  let authUser = await this.findOne({
    provider: 'email',
    identifier: email
  }).id()

  if (authUser) {
    throw new Error('User exists')
  }

  const signedIn = Date.now()
  const created = Date.now()

  // create authUser
  authUser = new this({
    provider: 'email',
    identifier: email,
    created,
    signedIn
  })

  // TODO: LOOK INTO WHETHER I SHOULD BE USING HASHSYNC
  authUser.passwordHash = bcrypt.hashSync(
    password + created,
    config.SALT_ROUNDS
  )

  return await authUser.save().id()
}

schema.statics.login = async function (identifier, password) {
  let authUser = await this.findOne({
    identifier
  }).id()

  if (authUser) {
    const timestamp = new Date(authUser.created).getTime()
    const isMatch = bcrypt.compareSync(password + timestamp, authUser.passwordHash)

    if (isMatch) {
      return authUser
    }
  }
}

module.exports = orango.model('Auth', schema)