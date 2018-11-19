const orango = require('../../../lib')
const { RETURN } = orango.CONSTS
require('../models/User')

const User = orango.model('User')

async function main() {
  await orango.connect('sample')

  let user = await User.findById('957720').defaults()//.return(RETURN.MODEL)//.toAQL()

  console.log('Return:\n', user)
}

main()
