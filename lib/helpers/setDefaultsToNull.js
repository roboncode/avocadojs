const { asyncForEach } = require('tangjs/lib/helpers')

async function setDefaultsToNull(data = {}, defaultValues = {}) {
  return await asyncForEach(data, async (item, prop, data) => {
    if (defaultValues.hasOwnProperty(prop)) {
      if (typeof item === 'object') {
        await setDefaultsToNull(item, defaultValues[prop])
      } else if (item === defaultValues[prop]) {
        data[prop] = null
      }
    }
  })
}

module.exports = async (data, defaultValues) => {
  data = JSON.parse(JSON.stringify(data))
  await setDefaultsToNull(data, defaultValues)
  return data
}
