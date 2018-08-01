const snooze = require('./snooze')

async function asyncForEach(data, cb) {
  let result
  for (let i in data) {
    if (data.hasOwnProperty(i)) {
      try {
        await snooze()
        result = await cb(data[i], i, data)
      } catch (e) {
        break
      }
    }
  }
  return result
}

module.exports = asyncForEach