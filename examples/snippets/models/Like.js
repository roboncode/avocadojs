const orango = require('../../../lib')
let schema = orango.EdgeSchema('User', 'Tweet')
module.exports = orango.model('Like', schema)
