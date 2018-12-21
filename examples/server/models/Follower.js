const orango = require('orango')
module.exports = orango.model(
  'Follower',
  {
    _from: String,
    _to: String
  },
  {
    from: 'User',
    to: 'User',
    edge: true,
    strict: true
  }
)
