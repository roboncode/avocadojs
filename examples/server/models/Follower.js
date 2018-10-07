const orango = require('orango')
let schema = orango.EdgeSchema('User', 'User')
module.exports = orango.model('Follower', schema)