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
  // Note: This can be done before or after the connection
  readFiles(path.join(__dirname, 'models'))

  // Create connection
  await arango.connect({
    name: 'demo'
  })

  // Import migration docs
  await importAllDocs()

  const User = arango.model('User')
  let user = await User
    // .setConnection(conn)
    .findById('rob')
  console.log('#user', user)
}

main()