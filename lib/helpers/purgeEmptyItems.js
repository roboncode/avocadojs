const isEmpty = require('./isEmpty')

function purgeEmptyItems(data) {
  for (let prop in data) {
    if (typeof data[prop] === 'object') {
      if (data[prop] instanceof Array) {
        if (!data[prop].length) {
          delete data[prop]
        }
      } else {
        purgeEmptyItems(data[prop])
        if (isEmpty(data[prop])) {
          delete data[prop]
        }
      }
    }
  }
}

module.exports = purgeEmptyItems
