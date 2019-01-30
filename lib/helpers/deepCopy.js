module.exports = function deepCopy(obj) {
  let clone = {}
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (obj[i] !== null && typeof obj[i] === 'object') {
        clone[i] = deepCopy(obj[i])
      } else {
        clone[i] = obj[i]
      }
    }
  }
  return clone
}
