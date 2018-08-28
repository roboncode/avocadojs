const Orango = require('../lib/Orango')
require('colors')

const o1 = Orango.get('o1')
o1.events.on('connected', () => {
  console.log('Orango #1 is connected!'.green)
})

const o2 = Orango.get('o2')
o2.events.on('connected', () => {
  console.log('Orango #2 is connected!'.green)
})

async function main() {
  await o1.connect()
  await o2.connect()
}

main()
