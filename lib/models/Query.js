const tang = require('tangjs')
const Joi = require('joi')

const QuerySchema = new tang.Schema(
  {
    model: { type: String, required: true },
    name: String,
    merge: Boolean,
    appendAs: String,
    lets: {},
    method: { type: String, default: 'find' },
    data: {},
    where: {},
    queries: [{
      id: String,
      query: {
        v: Number,
        q: Joi.lazy(() => QuerySchema.joi).description('Query schema')
      }
    }],
    // queries: Joi.array().items(Joi.object({
    //   id: Joi.string(),
    //   query: Joi.object({
    //     v: Joi.number(),
    //     q: Joi.lazy(() => QuerySchema.joi).description('Query schema')
    //   })
    // })),
    withDefaults: Boolean,
    sort: String,
    one: Boolean,
    offset: { type: Number, min: 0 },
    limit: { type: Number, min: 0 },
    select: String,
    defaults: Boolean,
    return: {
      value: Joi.any(),
      actions: [{
        action: String,
        target: String,
        as: String
      }],
      id: Boolean,
      computed: Boolean,
      toModel: Boolean,
    }
  },
  { strict: true }
)

module.exports = tang.model('Query', QuerySchema)