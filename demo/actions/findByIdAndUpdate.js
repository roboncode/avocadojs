const orango = require('../../lib')
require('../models/User')

const User = orango.model('User')

async function main() {
  await orango.connect('sample')

  let user = await User.findByIdAndUpdate('1376', {
    settings: { locale: 'es_SP' },
    stats: {
      friends: '++1'
    }
  }).return('new')

  console.log('Successfully updated:\n', user)
}

main()
