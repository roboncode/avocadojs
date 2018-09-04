const fs = require('fs')
const path = require('path')
const orango = require('../../lib')

function readFiles(dir) {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    require(dir + '/' + files[i])
  }
}

async function main() {
  // // Create connection
  await orango.connect('example')

  // Initialize models
  // Note: This can be done before or after the connection
  readFiles(path.join(__dirname, 'models'))

  const User = orango.model('User')
  let user = await User.findById('rob', {
    noDefaults: false,
    computed: true,
    printAQL: 'color'
  }).exec()
  
  console.log(user)
}

main()
