const orango = require('orango')
let schema = orango.EdgeSchema('User', 'Tweet')
module.exports = orango.model('Like', schema)
