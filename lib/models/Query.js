const tang = require('tangjs')
const Joi = require('joi')

const QuerySchema = new tang.Schema(
  {
    model: { type: String, required: true },
    name: String,
    lets: {},
    method: { type: String, default: 'find' },
    data: {},
    where: {},
    queries: [
      {
        let: String,
        query: Joi.lazy(() => QuerySchema.joi).description('Query schema')
      }
    ],
    withDefaults: Boolean,
    sort: String,
    one: Boolean,
    offset: { type: Number, min: 0 },
    limit: { type: Number, min: 0 },
    select: String,
    defaults: Boolean,
    return: Joi.alternatives().try(
      Joi.boolean(),
      Joi.object().keys({
        model: Joi.string().required(),
        value: Joi.any(),
        actions: Joi.array().items(
          Joi.object().keys({
            action: Joi.string(),
            target: Joi.string(),
            as: Joi.string()
          })
        ),
        id: Joi.boolean(),
        computed: Joi.boolean(),
        cast: Joi.boolean()
      })
    )
  },
  { strict: true }
)

module.exports = tang.model('Query', QuerySchema)