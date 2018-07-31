const avocado = require('./index')
const asyncForEach = require('./helpers/asyncForEach')
const microtime = require('microtime')
const snooze = require('./helpers/snooze')
const padding = 35


class Builder {

  static getInstance(name = 'default') {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[name]) {
      this._instances[name] = new this
    }
    return this._instances[name]
  }

  constructor() {
    this.methods = {}

    this.addMethod('convertTo', function (data, Model) {
      return new Model(data)
    })

    this.addMethod('toObject', function (model, options) {
      if (model.toObject) {
        return model.toObject(options)
      }
      throw new Error('toObject() requires first element to be of type Model')
    })

    this.addMethod('inspect', function (target, note = 'Inspect', index) {
      console.log(note, `[${index}] =>`, target)
      return target
    })

    this.addMethod('intercept', function (target, callback, index = 0) {
      return callback(target, index)
    })

    // let scope = this
    // scope.isArray = data instanceof Array
    // scope.items = [].concat(data)
    // scope.queue = []

    // let methods = Object.keys(avocado)
    // for (let i = 0; i < methods.length; i++) {
    //   let method = methods[i]
    //   if (!method.match(/schema/gi)) {
    //     scope[method] = function() {
    //       scope.queue.push({
    //         type: 'avocado',
    //         method,
    //         args: [].slice.call(arguments)
    //       })
    //       return scope
    //     }
    //   }
    // }

    // methods = Object.keys(registry)
    // for (let i = 0; i < methods.length; i++) {
    //   let method = methods[i]
    //   scope[method] = function() {
    //     scope.queue.push({
    //       type: 'custom',
    //       method,
    //       args: [].slice.call(arguments)
    //     })
    //     return scope
    //   }
    // }
  }

  data(data) {
    this.isArray = data instanceof Array
    this.items = [].concat(data)
    this.queue = []
    return this
  }

  addMethod(name, method) {
    this[name] = function () {
      let args = [].slice.call(arguments)
      this.queue.push({
        method,
        args
      })
      return this
    }
  }

  async exec(handler) {
    let report = []
    let startTotalTime = microtime.now()
    let startTime
    let items = this.items
    let result = await asyncForEach(items, async (item, index) => {
      return await asyncForEach(this.queue, async message => {
        if (handler) {
          startTime = microtime.now()
        }
        let args = [].concat(item, message.args, index, [items])
        try {
          await snooze()
          item = await message.method.apply(this, args)
          if (handler) {
            report.push(
              ('item[' + index + '].' + message.method + ': ').padEnd(padding) +
              (microtime.now() - startTime) * 0.001
            )
          }
          return item
        } catch (e) {
          return e
        }
      })
    })
    if (handler) {
      report.push(
        'totalTime:'.padEnd(padding) +
        (microtime.now() - startTotalTime) * 0.001 +
        ' ms'
      )
      handler(report.join('\n'))
    }
    if (this.isArray) {
      return this.items
    }
    return result
  }
}

module.exports = Builder