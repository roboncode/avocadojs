const users = require('./users')
const friends = [
  // colby and rob are friends
  {
    user: users.colby._key,
    friend: users.rob._key,
    tags: ['Dev', 'Demo']
  },
  {
    user: users.rob._key,
    friend: users.colby._key,
    tags: ['Client', 'Demo']
  },
  // chase and rob are friends
  {
    user: users.chase._key,
    friend: users.rob._key,
    tags: ['Work', 'Developer', 'Demo']
  },
  {
    user: users.rob._key,
    friend: users.chase._key,
    tags: ['Work', 'Developer', 'Demo', 'Neighbor']
  },
  // colby and chase are friends
  {
    user: users.colby._key,
    friend: users.chase._key,
    tags: ['Work', 'Realtor']
  },
  {
    user: users.chase._key,
    friend: users.colby._key,
    tags: ['Demo']
  }
]

module.exports = friends
