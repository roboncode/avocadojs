const isEmpty = require('./isEmpty')

function createDefaultTree(jsonSchema) {
  let data = {}
  for (let prop in jsonSchema) {
    if (jsonSchema.hasOwnProperty(prop)) {
      if (typeof jsonSchema[prop] === 'object') {
        if (jsonSchema[prop] instanceof Array) {
          data[prop] = []
        } else if (!jsonSchema[prop].type) {
          let val = createDefaultTree(jsonSchema[prop])
          if (val) {
            data[prop] = val
          }
        }
      }
    }
  }
  if (!isEmpty(data)) {
    return data
  }
}

module.exports = createDefaultTree
