const fs = require('fs')
const path = require('path')
const rootPath = path.join(__dirname, '..')
const orango = require(path.join(rootPath, 'lib'))
const { importAllDocs } = require('./migrations')

function readFiles(dir) {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    require(dir + '/' + files[i])
  }
}

async function main() {
  readFiles(path.join(__dirname, 'models'))

  // // Create connection
  await orango.connect('example')

  // // Import migration docs
  await importAllDocs()
}

main()
