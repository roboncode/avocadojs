require('colors')
const setup = require(__dirname + '/../helpers/setup')

const sleep = ms => new Promise(res => setTimeout(res, ms))

;(async function() {
  // get sample db
  const db = await setup()

  // await sleep(1000)

  // get a reference to User model
  const User = db.model('User')

  // find first item in users collection
  let rawData = await User.find().one()
  console.log('rawData'.green, rawData)

  // convert data to User model
  let user = User.fromJSON(rawData)
  console.log('User'.green, user)
})()
