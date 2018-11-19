const orango = require('../../lib')
require('../models/User')

const User = orango.model('User')

async function main() {
  await orango.connect('sample')

  let user = await User.findByIdAndDelete('1376')

  console.log('Successfully updated:\n', user)
}

main()
