const arrayOverride = require('./arrayOverride')
/**
 * This will ensure that the array paths are created in an object so functions like
 * push, pull, splice will work with the array override
 */
function mergeDefaultTree(modelData, defaultData) {
  for (let prop in defaultData) {
    if (typeof defaultData[prop] === 'object') {
      if (defaultData[prop] instanceof Array) {
        if (!modelData[prop]) {
          modelData[prop] = arrayOverride([])
        }
      } else if (!modelData[prop]) {
        modelData[prop] = {}
        modelData[prop] = mergeDefaultTree(modelData[prop], defaultData[prop])
      }
    }
  }
  return modelData
}

module.exports = mergeDefaultTree
