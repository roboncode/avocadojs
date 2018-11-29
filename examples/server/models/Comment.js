const orango = require('orango')

let schema = orango.Schema({
  user: String,
  tweet: String,
  text: { type: String, max: 140 },
  created: { type: Date, default: Date.now }
}, {
  strict: true,
  indexes: [
    {
      type: 'hash',
      fields: ['user']
    },
    {
      type: 'hash',
      fields: ['tweet']
    }
  ]
})

const Comment = orango.model('Comment', schema)

Comment.belongsTo('User', { ref: 'user' }) // one
Comment.belongsTo('Tweet', { ref: 'tweet' }) // one

module.exports = Comment
