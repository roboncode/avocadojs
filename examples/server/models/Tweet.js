const orango = require('orango')

let schema = orango.Schema(
  {
    user: String,
    text: { type: String, max: 140 },
    likes: { type: orango.Types.Any, default: 0 },
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

schema.statics.getTweets = async function(user, limit = 5, offset = 0) {
  return await this.findByQuery(
    `FOR user IN OUTBOUND "@@User/${user}" @@Follower  
        FOR tweet IN @@Tweet 
          FILTER tweet.user == user._key
          SORT tweet.created DESC`
  )
    .limit(limit)
    .offset(offset)
    .return(
      'MERGE(tweet, {user: KEEP(user, "screenName", "avatar", "firstName", "lastName")})'
    )
    .id()
    .each(item => {
      let user = item.user
      user.fullName = user.firstName + ' ' + user.lastName
      return item
    })
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
