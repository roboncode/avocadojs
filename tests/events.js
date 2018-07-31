require('../models/User')
const avocado = require('../avocado')
const User = avocado.model('User')

require('colors')

console.log('===================================================='.grey)
;(async function() {
  User.emitter.on('commit', async message => {
    await avocado.snooze()
    console.log('Commit called'.green, message)
  })

  User.emitter.on('sayHello', async (day, name) => {
    await avocado.snooze()
    console.log(`[${day}]:`, `Hi there, ${name}!`)
  })

  User.emitter.on('sayGoodbye', async () => {
    await avocado.snooze()
    console.log('Goodbye!'.green)
  })

  let user = new User({
    firstName: 'Rob',
    lastName: 'Taylor'
  })

  // Direct call to emitter
  user.emitter.emit('commit', 'Two men enter, one man leaves.')

  // Instance method
  user.sayHello('Saturday'.cyan)

  // Static method
  User.sayGoodbye()
})()
