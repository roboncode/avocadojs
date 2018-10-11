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

module.exports = orango.model('Comment', schema)
