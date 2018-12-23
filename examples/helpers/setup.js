require('app-module-path').addPath(__dirname + '/../../')
require('colors')

const orango = require('lib')
const EVENTS = require('lib/consts/events')
const invoke = require('./invoke')

module.exports = async function() {
  // get sample db
  let db = orango.get('sample')

  // listen for connection to ArangoDB
  db.events.on(EVENTS.CONNECTED, conn => {
    console.log('Connected to ArangoDB:'.green, conn.url + '/' + conn.name)
  })

  // connect to db
  await db.connect()

  // initialze models and inject db
  invoke(__dirname + '/../models', db)

  // return db
  return db
}
