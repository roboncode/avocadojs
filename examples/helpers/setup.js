require('app-module-path').addPath(__dirname + '/../../')
require('colors')

const orango = require('lib')
const EVENTS = require('lib/consts/events')
const invoke = require('./invoke')
const DATABASE = 'examples'

orango.logger.level = 'info'

async function initCollections(db) {

  const User = db.model('User')

  await User.import([
    {
      firstName: 'Eddie',
      lastName: 'VanHalen',
      born: 'January 26, 1955'
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
  console.log(`✅  Populated "${User.collectionName}" collection`.green)
}

async function initDatabase() {
  await orango.connect()
  await orango.dropDatabase(DATABASE)
  await orango.createDatabase(DATABASE)
  await orango.disconnect()
}

module.exports = async function() {
  await initDatabase()

  // get sample db
  let db = orango.get(DATABASE)

  // listen for connection to ArangoDB
  db.events.on(EVENTS.CONNECTED, conn => {
    console.log('✅  Connected to:'.green, conn.url + '/' + conn.name)
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
