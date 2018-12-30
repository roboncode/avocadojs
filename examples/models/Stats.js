module.exports = ({ orango }) => {
  class Stats extends orango.Model {
    constructor(data) {
      super(data, Stats.schema)
    }
  }

  Stats.schema = orango.Schema(
    {
      user: String,
      friends: { type: String, default: 0 },
      likes: { type: String, default: 0 }
    },
    {
      indexes: [{ type: 'hash', fields: ['user'] }]
    }
  )

  // do not create a collection for model (false)
  return orango.model('Stats', Stats)
}
