const orango = require('../../lib')
require('../models/User')

const User = orango.model('User')

async function main() {
  await orango.connect('sample')

  let user = await User.updateOne(
    { email: 'user@sample.com' },
    {
      settings: { locale: 'HELLO' },
      stats: {
        friends: '++1'
      }
    }
  ).toAQL()

  console.log('Successfully updated:\n', user)
}

main()
