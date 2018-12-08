const tang = require('tangjs')
const Joi = require('joi')

const QuerySchema = new tang.Schema(
  {
    model: { type: String, required: true },
    id: String,
    merge: Boolean,
    appendAs: String,
    method: { type: String, default: 'find' },
    data: {},
    filter: {},
    methods: Joi.array().items(Joi.lazy(() => QuerySchema.joi).description('Query schema')),
    withDefaults: Boolean,
    sort: String,
    offset: { type: Number, min: 0 },
    limit: { type: Number, min: 0 },
    select: String,
    defaults: Boolean,
    return: {
      id: Boolean,
      computed: Boolean,
      value: String,
      toModel: Boolean,
    }
  },
  { strict: true }
)

module.exports = tang.model('Query', QuerySchema)