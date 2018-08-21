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

  User.emitter.on('sayHello', async () => {
    await tang.snooze()
    console.log('Hi there!'.green)
  })

  let user = new User()

  console.log('@fullName', user.fullName)
  console.log('===================================================='.grey)

  // Direct call to emitter
  user.emitter.emit('commit', 'Two men enter, one man leaves.')

  // Instance method
  user.sayHello('Saturday'.cyan)

  // Static method
  User.sayGoodbye()
})()
