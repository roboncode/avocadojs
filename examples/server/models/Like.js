const orango = require('orango')
let schema = orango.Schema({
  _from: String,
  _to: String,
  notes: String
},
  {
    from: 'User',
    to: 'Tweet',
    edge: true,
    strict: true
  })
module.exports = orango.model(
  'Like', schema
)
