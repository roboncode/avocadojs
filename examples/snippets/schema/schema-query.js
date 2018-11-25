const orango = require('../../../lib')
require('../models/Tweet')
require('../models/User')
require('colors')

async function main() {
  await orango.connect('sample')

  try {
    let result = await orango.execQuery({
      model: 'Tweet',
      method: 'findOne',
      // criteria: { $or: [{_key: 'rob' }, {_key: 'john'}]},
      computed: true,
      // populate2: [
      //   { model: 'User' }
      // ],
      // select: 'firstName lastName',
      // toModel: true,
    })
    .toAQL()
    console.log('result'.bgGreen, result)
  } catch (e) {
    console.log('error'.bgRed, e.message)
  }
}

main()
