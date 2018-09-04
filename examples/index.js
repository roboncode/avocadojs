const orango = require('../lib')
require('colors')

orango.events.on('connected', () => {
  console.log('Orango is connected!'.green)
})

async function main() {
  // connect to database
  await orango.connect('example')
}

main()
