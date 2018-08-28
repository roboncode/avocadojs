function definePrivateProperty(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: false,
    writable: true
  })
}

module.exports = definePrivateProperty
