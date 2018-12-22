class Return {
  constructor(options = {}) {
    this.options = options
    this.options.actions = this.options.actions || []
  }

  value(val) {
    this.options.value = val
    return this
  }

  // one(val = true) {
  //   this.options.one = val
  //   return this
  // }

  // id(val = true) {
  //   if(!this.options.as) {
  //     this.options.id = val
  //   }
  //   return this
  // }

  // computed(val = true) {
  //   if (!this.options.as) {
  //     this.options.computed = val
  //   }
  //   return this
  // }

  // as(val = true) {
  //   this.options.as = val
  //   delete this.options.id
  //   delete this.options.computed
  //   return this
  // }

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
