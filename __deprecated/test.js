require('./mendy/models')
const orango = require('./orango')
const connection = require('./orango/Connection').getInstance()
const migrations = require('./mendy/migrations')
require('colors')


async function main() {
  await connection.connect(
    'http://127.0.0.1:8529',
    'mydb'
  )

  
  // await migrations.importMany()
  const User = orango.model('User')
  let doc = await User.findById('262219')
  console.log('#doc', doc)

  // await User.inc('262219', [
  //   'stats.friends',
  //   'stats.likes',
  //   'stats.followers',
  // ])

  // User.on('created', (userDoc) => {
  //   console.log('Static.onCreated'.bgRed, userDoc)
  // })

  // User.on('removed', (userDoc) => {
  //   console.log('Static.onRemoved'.bgRed, userDoc)
  // })
  
  // let user = new User({
  //   firstName: 'Fred',
  //   lastName: 'Flintstone'
  // })
  
  // user.on('created', (userDoc) => {
  //   console.log('Instance.onCreated'.bgRed, userDoc)
  // })

  // user.on('removed', (userDoc) => {
  //   console.log('Instance.onRemoved'.bgRed, userDoc)
  // })
  
  // await user.save() 

  // await user.remove()
}

main()
