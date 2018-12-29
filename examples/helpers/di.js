const fs = require('fs')
const path = require('path')

class DI {
  static injectDir(fullDirectoryPath, deps) {
    let files = fs.readdirSync(fullDirectoryPath)
    for (var i = 0; i < files.length; i++) {
      let file = files[i]
      if (file.match(/.js$/)) {
        this.injectFile(path.join(fullDirectoryPath, file), deps)
      }
    }
  }

  static injectFile(fullFilePath, deps) {
    let func = require(fullFilePath)
    this.inject(func, deps)
  }

  static inject(func, deps) {
    if (typeof func === 'function') {
      func.apply(func, [deps])
    }
  }
}

module.exports = DI
