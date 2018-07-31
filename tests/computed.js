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

  User.emitter.on('sayHello', async () => {
    await avocado.snooze()
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
