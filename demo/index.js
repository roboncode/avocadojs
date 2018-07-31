const fs = require('fs')
const path = require('path')
const rootPath = path.join(__dirname, '..')
const arango = require(path.join(rootPath, 'arango'))
const {
  importAllDocs
} = require(path.join(__dirname, 'migrations'))
require('colors')

arango.events.on('connected', () => {
  console.log('Arango is connected!'.green)
})

function readFiles(dir) {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    require(dir + '/' + files[i])
  }
}

async function main() {
  // Initialize models
  readFiles(path.join(__dirname, 'models'))

  // Create connection
  const conn = await arango.connect({
    name: 'demo'
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