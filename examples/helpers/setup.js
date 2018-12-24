require('app-module-path').addPath(__dirname + '/../../')
require('colors')

const orango = require('lib')
const EVENTS = require('lib/consts/events')
const invoke = require('./invoke')
const DATABASE = 'examples'

async function initCollections(db) {

  const User = db.model('User')

  await User.import([
    {
      firstName: 'Eddie',
      lastName: 'VanHalen'
    },
    {
      firstName: 'Steve',
      lastName: 'Vai'
    },
    {
      firstName: 'Randy',
      lastName: 'Rhoads'
    },
    {
      firstName: 'Alex',
      lastName: 'Lifeson'
    },
    {
      firstName: 'Slash'
    }
  ])
}

async function initDatabase() {
  await orango.connect()
  console.log('✅ Connected to:'.green, orango.connection.url + '/' + orango.connection.name)

  await orango.dropDatabase(DATABASE)
  console.log('✅ Drop database:'.green, DATABASE)

  await orango.createDatabase(DATABASE)
  console.log('✅ Create database:'.green, DATABASE)

  let names = await orango.connection.db.listDatabases()
  console.log('ℹ️ Available databases:'.cyan, names)

  console.log('✅ Disconnecting from:'.green, orango.connection.name)
  await orango.disconnect()
}

module.exports = async function() {
  await initDatabase()

  // get sample db
  let db = orango.get(DATABASE)

  // listen for connection to ArangoDB
  db.events.on(EVENTS.CONNECTED, conn => {
    console.log('✅ Connected to:'.green, conn.url + '/' + conn.name)
  })

  // initialze models and inject db
  invoke(__dirname + '/../models', db)

  // connect to db
  await db.connect()

  // create collections
  await initCollections(db)

  // return db
  return db
}
