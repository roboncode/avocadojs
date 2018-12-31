module.exports = ({ orango }) => {
  class Stats extends orango.Model {
    constructor(data) {
      super(data, Stats.schema)
    }
  }

  Stats.schema = orango.Schema(
    {
      user: String,
      friends: { type: orango.Types.Any, default: 0 },
      likes: { type: orango.Types.Any, default: 0 },
      following: { type: orango.Types.Any, default: 0 }
    },
    {
      indexes: [{ type: 'hash', fields: ['user'] }]
    }
  )

  // do not create a collection for model (false)
  return orango.model('Stats', Stats)
}
