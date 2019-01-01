const Joi = require('joi')

module.exports = ({ orango }) => {
  class Settings extends orango.Model {
    constructor(data) {
      // Settings.schema.custom = orango.model('Custom').schema
      super(data, Settings.schema)
      this.online = false
    }
  }

  Settings.schema = orango.Schema({
    online: Boolean,
    custom: Joi.lazy(function() {
      return orango.model('Custom').schema.joi
    })
  })

  Settings.struct = {
    custom: 'Custom'
  }

  // do not create a collection for model (false)
  return orango.model('Settings', Settings, false)
}
