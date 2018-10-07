const orango = require('orango')
let schema = orango.EdgeSchema('users', 'following')
module.exports = orango.model('Follower', schema)
