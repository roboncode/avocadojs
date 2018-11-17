const orango = require('../../lib')
require('../models/User')

const User = orango.model('User')

async function main() {
  await orango.connect('sample')

  let user = await User.findById('957720')//.toAQL()

  console.log('Successfully updated:\n', user)
}

main()
