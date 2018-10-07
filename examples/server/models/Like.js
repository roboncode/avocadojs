const orango = require('orango')
const pluralize = require('pluralize')
const { convertToSnakecase } = orango.helpers

let users = convertToSnakecase(pluralize('User'))
let tweet = convertToSnakecase(pluralize('Tweet'))
let schema = orango.EdgeSchema(users, tweet)
module.exports = orango.model('Like', schema)
