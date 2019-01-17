const Joi = require('joi')

module.exports = ({ orango }) => {

  let schema = new orango.Schema({
    online: Boolean,
    custom: orango.types.Schema('Custom'),
    // online: { type: Boolean, onInsert: false } // TODO: default props
  })

  // Settings.struct = {
  //   custom: 'Custom'
  // }

  // Settings.hooks = {
  //   async insert(model) {
  //     model.online = false
  //   }
  // }

  // do not create a collection for model (false)
  return orango.model('Settings', schema, false)
}
