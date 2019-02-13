const Joi = require('joi')

// Schema.Types.Array = Joi.alternatives().try(
//   Joi.array(),
//   Joi.string()
//     .trim()
//     .regex(/@{(.+?)}/)
//     .error(new Error('Must be an Orango expression @{...}'))
// )

module.exports = ({ orango }) => {
  const schema = new orango.Schema(
    {
      name: String,
      location: [Number],
      // location: orango.types.Array,
      // location: Joi.array().items(Joi.number(), Joi.string()),
      created: { type: Date, default: Date.now },
      updated: { type: Date, defaultOnUpdate: Date.now }
    },
    {
      indexes: [{ type: 'geo', fields: ['location'] }]
    }
  )

  return orango.model('Site', schema)
}
