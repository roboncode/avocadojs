const bcrypt = require('bcrypt')
const config = require('../../../config')

const myPlaintextPassword = 'password'

let data = {
  john: {
    username: 'john',
    created: 1539048018793
  },
  rob: {
    username: 'rob',
    created: 1539048069260
  },
  jane: {
    username: 'jane',
    created: 1539048089960
  }
}

for (let n in data) {
  data[n].passwordHash = bcrypt.hashSync(
    myPlaintextPassword + data[n].created,
    config.SALT_ROUNDS
  )
}

module.exports = data
