require('app-module-path').addPath(__dirname + '/../../')
require('colors')

const orango = require('lib')
const { EVENTS } = orango.consts
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
  // TODO: There is something not working in DI
  // await di.injectDir(__dirname + '/../seed', { orango: db })

  await di.injectFile(__dirname + '/../seed/doc_identities.js', { orango: db })
  await di.injectFile(__dirname + '/../seed/doc_stats.js', { orango: db })
  await di.injectFile(__dirname + '/../seed/doc_tweets.js', { orango: db })
  await di.injectFile(__dirname + '/../seed/doc_users.js', { orango: db })
  await di.injectFile(__dirname + '/../seed/edge_comments.js', { orango: db })

  // return db
  return db
}
