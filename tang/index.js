const factory = require('./factory')
const Schema = require('./Schema')
const asyncForEach = require('./helpers/asyncForEach')

class Tang {
  constructor() {
    this.models = []
  }

  model(name, schema, options = {}) {
    if (schema) {
      this.models[name] = factory(name, schema, options)
    }
    if (!this.models[name]) {
      throw new Error('Model not found:' + name)
    }
    return this.models[name]
  }

  get Schema() {
    return Schema
  }

  async validate(target, options = {}) {
    let isArray = target instanceof Array
    let returnVal = {}
    if (isArray) {
      returnVal = []
    }

    const breakOnError = options.breakOnError
    delete options.breakOnError

    returnVal = await asyncForEach([].concat(target), async model => {
      try {
        let data = await model.validate(options)
        if (isArray) {
          returnVal.push(data)
          return returnVal
        }
        return data
      } catch (err) {
        if (breakOnError) {
          return Promise.reject({ index, model, err })
        }
        errors.push({ index, model, err })
      }
    })
    return returnVal
  }
}

module.exports = new Tang()