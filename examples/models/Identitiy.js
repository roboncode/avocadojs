module.exports = ({ orango }) => {
  const { SCHEMA } = orango.consts
  
  let schema = new orango.Schema(
    {
      user: String, // user ID
      provider: String, // google, facebook, etc
      identifier: String, // email, phone#
      passwordHash: String,
      connection: String, // Username-Password-Authentication, google-oauth2, etc
      isSocial: Boolean,
      verified: Boolean
    },
    {
      indexes: [
        {
          type: SCHEMA.INDEX.HASH,
          fields: ['provider']
        },
        {
          type: SCHEMA.INDEX.HASH,
          fields: ['connection']
        },
        {
          type: SCHEMA.INDEX.HASH,
          fields: ['identifier']
        }
      ]
    }
  )

  return orango.model('Identity', schema)
}
