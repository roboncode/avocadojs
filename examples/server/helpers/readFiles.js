const fs = require('fs')
const path = require('path')

function readFiles(dir) {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    require(path.join(dir, files[i]))
  }
}

module.exports = readFiles
