const snooze = require('./snooze')

async function asyncForEach(data, cb, path = []) {
  let result
  path = path.slice()
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      try {
        await snooze()
        path.push(prop)
        result = await cb(data[prop], prop, data, path)
      } catch (e) {
        break
      }
    }
    path.pop()
  }
  return result
}

module.exports = asyncForEach