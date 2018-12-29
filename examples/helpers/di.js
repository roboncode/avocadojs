const fs = require('fs')
const path = require('path')

class DI {
  static async injectDir(fullDirectoryPath, deps) {
    let files = fs.readdirSync(fullDirectoryPath)
    let promises = []
    for (var i = 0; i < files.length; i++) {
      let file = files[i]
      if (file.match(/.js$/)) {
        promises.push(this.injectFile(path.join(fullDirectoryPath, file), deps))
      }
    }
    return await Promise.all(promises)
  }

  static async injectFile(fullFilePath, deps) {
    let func = require(fullFilePath)
    await this.inject(func, deps)
  }

  static async inject(func, deps) {
    if (typeof func === 'function') {
      await func.apply(func, [deps])
    }
  }
}

module.exports = DI
