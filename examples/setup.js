require('app-module-path').addPath(__dirname + '/')
require('colors')

const orango = require('../lib')
const { EVENTS } = orango.consts
const di = require('./helpers/di')

orango.logger.level = 'info'

async function initDatabase(config) {
  await orango.connect(config.default)
  await orango.dropDatabase(config.db)
  await orango.createDatabase(config.db)
  await orango.disconnect()
}

module.exports = async function(config) {
  await initDatabase(config)

  // get sample db
  let db = orango.get(config.db)

  // listen for connection to ArangoDB
  db.events.once(EVENTS.CONNECTED, conn => {
    console.log('🥑  Connected to ArangoDB:'.green, conn.url + '/' + conn.name)
  })

  db.events.once(EVENTS.READY, () => {
    console.log('🍊  Orango is ready!'.green)
  })

  // :: What do you want to do? :: //
  let initializeConnectionFirst = false
  if (initializeConnectionFirst) {
    // connect to db
    await db.connect(config.default)
    // initialze models and inject db
    await di.injectDir(__dirname + '/models', { orango: db, config })
  } else {
    // initialze models and inject db
    di.injectDir(__dirname + '/models', { orango: db, config })
    // connect to db
    await db.connect(config.default)
  }

  // populate collections
  await di.injectDir(__dirname + '/seed', { orango: db, config })

  return db
}
