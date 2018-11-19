const orango = require('../../../lib')
require('../models/User')
const { RETURN } = orango.CONSTS

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
  )
    .computed()
    // .return(RETURN.NEW_OLD_MODEL)
    // .toAQL()

  console.log('Successfully updated:\n', user)
}

main()
