const orango = require('../../../lib')
require('../models/User')

const User = orango.model('User')

async function main() {
  await orango.connect('sample')

  let user = await User.findByQuery(`
  FOR $user IN users
    LET hasComments = FIRST(
      FOR comment IN comments
      FILTER comment.user == $user._key
      COLLECT WITH COUNT INTO length
      RETURN length
    )
    FILTER hasComments
  `)
  .select('_key firstName lastName')
  .computed()
  .id()

  console.log('Return:\n', user)
}

main()
