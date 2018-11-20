const orango = require('../../../lib')
const {
  RETURN
} = orango.CONSTS

require('../models/User')


const User = orango.model('User')

async function main() {
  await orango.connect('sample')

  let user = await User.update(
    { email: 'user@sample.com' },
    {
      settings: { locale: 'es_SP' },
      stats: {
        friends: '++1'
      }
    }
  )
  .computed()
  // .return(RETURN.NEW_OLD)
  .return(RETURN.DOC)
  // .toModel()
  // .toAQL()

  console.log('Successfully updated:\n', user)
}

main()
