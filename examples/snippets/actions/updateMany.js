const orango = require('../../lib')
require('../models/User')

const User = orango.model('User')

async function main() {
  await orango.connect('sample')

  let user = await User.updateMany(
    { email: 'user@sample.com' },
    {
      settings: { locale: 'es_SP' },
      stats: {
        friends: '++1'
      }
    }
  )

  console.log('Successfully updated:\n', user)
}

main()
