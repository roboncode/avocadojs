const orango = require('../../lib')

let schema = orango.Schema({
  version: { type: String, default: '1.0' },
  priority: { type: Number, default: 0 },
  label: String,
  icon: String,
  link: String,
  filters: [
    {
      label: String,
      type: { type: String }
    }
  ]
})
module.exports = orango.model('Category', schema)
