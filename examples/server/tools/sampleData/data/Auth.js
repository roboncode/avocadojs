const bcrypt = require('bcrypt')
const config = require('../../../config')

const myPlaintextPassword = 'password'

let data = {
  john: {
    provider: 'email',
    identifier: 'john@chirpy.com',
    created: 1539048018793,
    signedIn: 1539048018793,
  },
  rob: {
    provider: 'email',
    identifier: 'rob@chirpy.com',
    created: 1539048069260,
    signedIn: 1539048069260,
  },
  jane: {
    provider: 'email',
    identifier: 'jane@chirpy.com',
    created: 1539048089960,
    signedIn: 1539048089960,
  }
}

for (let n in data) {
  data[n].passwordHash = bcrypt.hashSync(
    myPlaintextPassword + data[n].created,
    config.SALT_ROUNDS
  )
}

module.exports = data