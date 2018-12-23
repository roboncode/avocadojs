const fs = require('fs')
const path = require('path')

module.exports = (dir, ...injections) => {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    let file = files[i]
    if (file.match(/.js$/)) {
      let item = require(path.join(dir, file))
      if (typeof item === 'function') {
        item.apply(item, injections)
      }
    }
  }
}
