const Joi = require('joi')

module.exports = orango => {
  const schema = new orango.Schema({
    model: { type: String, required: true },
    name: String,
    lets: {},
    method: { type: String, default: 'find' },
    data: {},
    where: {},
    queries: [
      {
        let: String,
        query: Joi.lazy(() => schema._validator.joi).description(
          'Query schema'
        )
      }
    ],
    withDefaults: Boolean,
    sort: Joi.any(),
    one: Boolean,
    offset: { type: Number, min: 0 },
    limit: { type: Number, min: 0 },
    select: String,
    defaults: Boolean,
    outbound: {
      target: String,
      id: String,
      options: {
        weightAttribute: String,
        defaultWeight: Number
      }
    },
    inbound: {
      target: String,
      id: String,
      options: {
        weightAttribute: String,
        defaultWeight: Number
      }
    },
    return: Joi.alternatives().try(
      Joi.boolean(),
      Joi.object().keys({
        value: Joi.any(),
        actions: Joi.array().items(
          Joi.object().keys({
            action: Joi.string(),
            target: Joi.string(),
            as: Joi.string()
          })
        ),
        distinct: Joi.boolean()
      })
    )
  })

  return orango.model('Query', schema, false)
}
