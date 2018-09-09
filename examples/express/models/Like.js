const orango = require('orango')
const pluralize = require('pluralize')
const { convertToSnakecase } = orango.helpers

let users = convertToSnakecase(pluralize('User'))
let posts = convertToSnakecase(pluralize('Post'))
let schema = orango.EdgeSchema(users, posts)
module.exports = orango.model('Like', schema)
