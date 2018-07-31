const fs = require('fs')
const arango = require('./arango/Arango').getInstance()
const EventDispatcher = require('./avocado/EventDispatcher')
const events = EventDispatcher.getInstance('mydb')
const {importAllDocs} = require('./demo/migrations')
require('colors')

events.on('connected', () => {
  console.log('we are connected'.green)
})

function readFiles(dir) {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    require(dir + '/' + files[i])
  }
}

async function main() {
  // Initialize models
  readFiles('./demo/models')
  // require('./demo/models/User')

  // Create connection
  const conn = await arango.connect({
    name: 'mydb'
  })

  // Initialize database
  await arango.initDatabase(conn, arango.models)

  // Import migration docs
  await importAllDocs(conn)

  const User = arango.model('User')
  let user = await User
    // .setConnection(conn)
    .findById('rob')
  console.log('#user', user)
}

main()