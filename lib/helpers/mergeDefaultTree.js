const definePrivateProperty = require('../../tang/helpers/definePrivateProperty')
const precision = 16

function mergeDefaultTree(modelData, defaultData) {
  for (let prop in defaultData) {
    if (typeof defaultData[prop] === 'object') {
      if (defaultData[prop] instanceof Array) {
        if (!modelData[prop]) {
          modelData[prop] = []
        }
      } else if (!modelData[prop]) {
        modelData[prop] = {}
        modelData[prop] = mergeDefaultTree(modelData[prop], defaultData[prop])
      }
    }
  }
}

module.exports = mergeDefaultTree
