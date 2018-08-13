function getObjectKeys(data, keys = [], prefix = '') {
  let objectKeys = Object.keys(data)
  for (let i = 0; i < objectKeys.length; i++) {
    const key = objectKeys[i]
    if (typeof data[key] === 'object') {
      if (data[key].isJoi) {
        continue
      }
      if (data[key].type) {
        continue
      }
      let k = getObjectKeys(data[key], [], key)
      if (data[key] instanceof Array) {
        if (k.length) {
          keys = keys.concat(key + '[].' + k[0].substr(2))
        } else {
          keys = keys.concat(key + '[]')
        }
      } else {
        keys = keys.concat(k)
      }
    } else {
      keys.push((prefix ? prefix + '.' : '') + key)
    }
  }
  return keys
}

module.exports = getObjectKeys