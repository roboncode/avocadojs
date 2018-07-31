function definePrivateProperty(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: false
  })
}

module.exports = definePrivateProperty
