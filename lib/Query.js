const tang = require('tangjs')

const QuerySchema = new tang.Schema(
  {
    model: String,
    method: { type: String, default: 'find' },
    computed: Boolean,
    critiera: {},
    options: {},
    populate: Joi.array().items(Joi.lazy(() => QuerySchema.joi).description('Query schema')),
    withDefaults: Boolean,
    sort: String,
    offset: { type: Number, min: 0 },
    limit: { type: Number, min: 0 },
    one: Boolean,
    return: String,
    select: String,
    defaults: Boolean,
    id: Boolean,
    toModel: Boolean
  },
  { strict: true }
)

export default tang.model('Query', QuerySchema)