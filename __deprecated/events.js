require('../models/User')
const tang = require('../tang')
const User = tang.model('User')

require('colors')

console.log('===================================================='.grey)
;(async function() {
  User.emitter.on('commit', async message => {
    await tang.snooze()
    console.log('Commit called'.green, message)
  })

  User.emitter.on('sayHello', async (day, name) => {
    await tang.snooze()
    console.log(`[${day}]:`, `Hi there, ${name}!`)
  })

  User.emitter.on('sayGoodbye', async () => {
    await tang.snooze()
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
