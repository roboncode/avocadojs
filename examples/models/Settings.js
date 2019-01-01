const Joi = require('joi')

module.exports = ({ orango }) => {
  class Settings extends orango.Model {
    constructor(data) {
      super(data, Settings.schema)
    }
  }

  Settings.schema = orango.schema({
    online: Boolean,
    custom: orango.Types.Schema('Custom')
  })

  Settings.struct = {
    custom: 'Custom'
  }

  Settings.hooks = {
    async insert(model) {
      model.online = false
    }
  }

  // do not create a collection for model (false)
  return orango.model('Settings', Settings, false)
}
