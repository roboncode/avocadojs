const users = require('./users')
const friends = [
  // john and rob are friends
  {
    user: users.john._key,
    friend: users.rob._key,
    tags: ['Dev', 'Demo']
  },
  {
    user: users.rob._key,
    friend: users.john._key,
    tags: ['Client', 'Demo']
  },
  // jane and rob are friends
  {
    user: users.jane._key,
    friend: users.rob._key,
    tags: ['Work', 'Developer', 'Demo']
  },
  {
    user: users.rob._key,
    friend: users.jane._key,
    tags: ['Work', 'Developer', 'Demo', 'Neighbor']
  }
]

module.exports = friends
