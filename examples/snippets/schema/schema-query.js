const orango = require('../../../lib')
require('colors')

async function main() {
  try {
    let result = await orango.query({
      model: 'Post',
      computed: true,
      foo: 'bar'
    })
    console.log('result'.bgGreen, result)
  } catch (e) {
    console.log('error'.bgRed, e.message)
  }
  
}

main()