const orango = require('../../../lib')

const TweetSchema = orango.Schema({
  name: String
})

const Tweet = orango.model('Tweet', TweetSchema)

module.exports = Tweet
