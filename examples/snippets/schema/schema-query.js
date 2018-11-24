const orango = require('../../../lib')
require('../models/User')
require('colors')

async function main() {
  await orango.connect('sample')

  try {
    let result = await orango.execQuery({
      model: 'User',
      // method: 'findOne',
      criteria: { $or: [{_key: 'rob' }, {_key: 'john'}]},
      computed: true,
      select: 'firstName lastName',
      // toModel: true
    })
    console.log('result'.bgGreen, result)
  } catch (e) {
    console.log('error'.bgRed, e.message)
  }
}

main()
