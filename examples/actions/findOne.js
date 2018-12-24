require('colors')
const setup = require(__dirname + '/../helpers/setup')

;(async function() {
  // get sample db
  const db = await setup()

  // get a reference to User model
  const User = db.model('User')

  // FOR DEMO ONLY - show the AQL
  let aql = await User.find().one().toAQL(true)
  console.log(aql.cyan)

  // find first item in users collection
  let rawData = await User.find().one()
  console.log('rawData'.green, rawData)

  // convert data to model
  let user = User.fromJSON(rawData)
  console.log('modelData'.green, user)
})()
