function getObjectKeys(data, keys = [], prefix = '') {
  for (let key in data) {
    if (typeof data[key] === 'object' && !data[key].type) {
      let k = getObjectKeys(data[key], [], key)
      if (data[key] instanceof Array &&  data[key].length) {
        keys = keys.concat(key + '[].' + k[0].substr(2))
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