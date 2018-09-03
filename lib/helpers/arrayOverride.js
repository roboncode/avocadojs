const { definePrivateProperty} = require('tangjs/lib/helpers')

function overrideArray(array = []) {
  definePrivateProperty(array, 'isOverridden', true)

  // override "push()"
  definePrivateProperty(array, 'push', function(...value) {
    if (value instanceof Array) {
      for (let i = 0; i < value.length; i++) {
        try {
          definePrivateProperty(value[i], 'isNew', true)
        } catch (e) {}
      }
    } 
    Array.prototype.push.apply(this, value)
  })

  // override "splice()"
  definePrivateProperty(array, 'splice', function() {
    this.isOverridden = false
    return Array.prototype.splice.apply(this, arguments)
  })

  // define "pull()"
  definePrivateProperty(array, 'pull', function(...ids) {
    this.pulls = [].concat(ids)
  })

  return array
}

module.exports = overrideArray
