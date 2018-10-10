const orango = require('orango')

let schema = orango.Schema(
  {
    user: String,
    text: { type: String, max: 140 },
    likes: { type: orango.Types.Any, default: 0 },
    comments: { type: orango.Types.Any, default: 0 },
    created: { type: Date }
  },
  {
    strict: true,
    indexes: [
      {
        type: 'hash',
        fields: ['user']
      },
      {
        type: 'hash',
        fields: ['created']
      },
      {
        type: 'hash',
        fields: ['likes']
      }
    ]
  }
)

/**
 * Not all queries can be created through the ORM. This example shows a custom query still using the ODM
 */
schema.statics.getTweets = async function(user, limit = 10, offset = 0) {
  return await this.findByQuery(
    `LET followers = (FOR user IN OUTBOUND "users/${user}" followers RETURN user._key)
    LET users = UNION(['${user}'], followers)
    FOR tweet IN tweets 
        FILTER POSITION( users, tweet.user )
        SORT tweet.created DESC 
        LET user = DOCUMENT(CONCAT('users/', tweet.user))`
  )
    .limit(limit)
    .offset(offset)
    .defaults(true)
    .return(`MERGE(tweet, {user: UNSET(user, 'authId')})`)
    .id()
    // .toAQL()
}

schema.statics.getTweet = async function(id) {
  const User = orango.model('User')
  return await this.findById(id).populate(
    'user',
    User.findById('@@parent.user').select(
      '_key screenName firstName lastName avatar'
    )
  )
}

module.exports = orango.model('Tweet', schema)
