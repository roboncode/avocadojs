class Return {
  constructor(options = {}) {
    this.options = options
    this.options.actions = this.options.actions || []
  }

  value(val = true) {
    this.options.value = val
    return this
  }

  append(target, as) {
    this.options.actions.push({
      action: 'append',
      target,
      as
    })
    return this
  }

  merge(target) {
    this.options.actions.push({
      action: 'merge',
      target
    })
    return this
  }

  one(val = true) {
    this.options.one = val
    return this
  }

  toJSON() {
    return this.options
  }
}

module.exports = Return
