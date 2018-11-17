const orango = require('../../lib')

orango.events.on('connected', () => {
  console.log('Orango is connected!')
})

async function main() {
  await orango.connect()
}

main()
