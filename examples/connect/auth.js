const orango = require('../../../lib')

orango.events.on('connected', () => {
  console.log('Orango is connected!')
})

async function main() {
  try {
    await orango.connect('sample', {
      url: 'http://localhost:10529',
      username: 'admin',
      password: 'secret'
    })
  } catch(e) {
    console.log('error:', e.message)
  }
}

main()
