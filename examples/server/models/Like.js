const orango = require('orango')
module.exports = orango.model(
  'Like',
  {
    _from: String,
    _to: String
  },
  {
    from: 'User',
    to: 'Tweet',
    edge: true,
    strict: true
  }
)
