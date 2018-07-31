const snooze = require('./snooze')

async function asyncForEach(array, cb) {
  let result
  for (let i = 0; i < array.length; i++) {
    try {
      await snooze()
      result = await cb(array[i], i, array)
    } catch (e) {
      break
    }
  }
  return result
}

module.exports = asyncForEach