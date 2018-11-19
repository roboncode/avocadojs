const orango = require('../../../lib')
require('../models/User')

const User = orango.model('User')

async function main() {
  await orango.connect('sample')

  let user = new User({
    email: 'user@sample.com'
  })
  await user.save().withDefaults()
  console.log('Successfully added:\n', user)
}

main()
