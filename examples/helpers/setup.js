require('app-module-path').addPath(__dirname + '/../../')
require('colors')

const orango = require('lib')
const { EVENTS } = orango.CONSTS
const di = require('./di')
const DATABASE = 'examples'

orango.logger.level = 'info'

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
  db.events.on(EVENTS.READY, conn => {
    console.log('✅  Connected to:'.green, conn.url + '/' + conn.name)
  })

  // :: What do you want to do? :: //
  let initializeConnectionFirst = false
  if (initializeConnectionFirst) {
    // connect to db
    await db.connect()
    // initialze models and inject db
    await di.injectDir(__dirname + '/../models', { orango: db })
  } else {
    // initialze models and inject db
    di.injectDir(__dirname + '/../models', { orango: db })
    // connect to db
    await db.connect()
  }

  // populate collections
  await di.injectDir(__dirname + '/../migrations', { orango: db })

  // return db
  return db
}
