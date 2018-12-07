const orango = require('orango')
const bcrypt = require('bcrypt')
const { CONNECTION, PROVIDER } = require('../consts')

function filterIdentity(identity) {
  delete identity.passwordHash
  delete identity.connection
  delete identity.isSocial
  return identity
}

const IdentitySchema = orango.Schema(
  {
    user: String, // user ID
    provider: String, // mendy, auth0, google, facebook, etc
    identifier: String, // email, phone#
    passwordHash: String,
    connection: String, // Username-Password-Authentication, google-oauth2, etc
    isSocial: { type: Boolean, default: false },
    verified: { type: Boolean, default: false }
  },
  {
    strict: true,
    indexes: [
      {
        type: 'hash',
        fields: [ 'provider' ]
      },
      {
        type: 'hash',
        fields: [ 'connection' ]
      },
      {
        type: 'hash',
        fields: [ 'identifier' ]
      }
    ]
  }
)

IdentitySchema.statics.userExists = async function(email) {
  let identity = await this.findOne({
    provider: PROVIDER,
    connection: CONNECTION.USER_PASS,
    identifier: email
  }).id()

  return !!identity
}

IdentitySchema.statics.createUserPass = async function(userId, email, password) {
  let identity = new this({
    user: userId,
    provider: PROVIDER,
    connection: CONNECTION.USER_PASS,
    identifier: email,
    passwordHash: bcrypt.hashSync(email + password, Number(process.env.SALT_ROUNDS))
  })

  identity = await identity.save().withDefaults().id()
  return filterIdentity(identity)
}

IdentitySchema.statics.authUserPass = async function(identifier, password) {
  let identity = await this.findOne({
    provider: PROVIDER,
    connection: CONNECTION.USER_PASS,
    identifier
  }).id()

  if (identity && identity.provider === PROVIDER) {
    const isMatch = bcrypt.compareSync(identifier + password, identity.passwordHash)

    if (isMatch) {
      return filterIdentity(identity)
    }
  }
}

orango.model('Identity', IdentitySchema)
