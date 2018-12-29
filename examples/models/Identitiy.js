module.exports = ({ orango }) => {

  class Identity extends orango.Model {}

  Identity.schema = orango.Schema(
    {
      user: String, // user ID
      provider: String, // mendy, auth0, google, facebook, etc
      identifier: String, // email, phone#
      passwordHash: String,
      connection: String, // Username-Password-Authentication, google-oauth2, etc
      isSocial: Boolean,
      verified: Boolean
    },
    {
      strict: true,
      indexes: [
        {
          type: 'hash',
          fields: ['provider']
        },
        {
          type: 'hash',
          fields: ['connection']
        },
        {
          type: 'hash',
          fields: ['identifier']
        }
      ]
    }
  )

  return orango.model('Identity', Identity)
}

