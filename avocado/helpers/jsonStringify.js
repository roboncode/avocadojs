function JSONstringify(o) {
  let cache = []
  let str = JSON.stringify(o, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return
      }
      // Store value in our collection
      cache.push(value)
    }
    return value
  })
  delete cache
  return str
}

module.exports = JSONstringify