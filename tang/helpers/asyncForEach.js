const snooze = require('./snooze')

async function asyncForEach(data, cb, steps = []) {
  let result
  steps = steps.slice()
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      try {
        await snooze()
        steps.push(prop)
        result = await cb(data[prop], prop, data, steps)
      } catch (e) {
        break
      }
    }
    steps.pop()
  }
  return result
}

module.exports = asyncForEach