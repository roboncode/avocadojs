require('colors')
const setup = require('./helpers/setup')

;(async function() {
  // get sample db
  const db = await setup()

  // get a reference to User model
  const User = db.model('User')

  // find first item in users collection
  let rawData = await User.find().one()
  console.log('rawData'.green, rawData)

  // convert data to User model
  let user = User.fromJSON(rawData)
  console.log('User'.green, user)
})()
