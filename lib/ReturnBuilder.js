class ReturnBuilder {
  constructor(options = {}) {
    this.options = options
    this.options.actions = this.options.actions || []
  }

  value(val = true) {
    if (val === 'new' || val === 'old') {
      val = val.toUpperCase()
    }
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

  distinct() {
    this.options.distinct = true
    return this
  }

  model() {
    this.options.model = true
    return this
  }

  toJSON() {
    return this.options
  }
}

module.exports = ReturnBuilder
