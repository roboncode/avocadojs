const Joi = require('joi')

module.exports = ({ orango }) => {

  let schema = new orango.Schema({
    online: { type: Boolean, default: true },
    custom: 'Custom'
  })

  // do not create a collection for model (false)
  return orango.model('Settings', schema, false)
}
