const definePrivateProperty = require('../../tang/helpers/definePrivateProperty')
const precision = 16

function overrideArray(array) {
  definePrivateProperty(array, 'push', function(...args) {
    if (args instanceof Array) {
      for (let i = 0; i < args.length; i++) {
        args[i].$id = Math.round(Math.random() * precision ** 12)
          .toString(precision)
          .toUpperCase()
        args[i].isNew = true
      }
    } else {
      args.$id = Math.round(Math.random() * precision ** 12)
        .toString(precision)
        .toUpperCase()
      args.isNew = true
    }
    return Array.prototype.push.apply(this, args)
  })
}

module.exports = overrideArray
