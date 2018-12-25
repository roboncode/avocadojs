module.exports = orango => {
  class Band extends orango.Model {
    constructor(data) {
      super(data, Band.schema)
    }
  }

  /**
   * Validates data going to ArangoDB
   */
  Band.schema = orango.Schema(
    {
      name: String,
      bio: String,
      formed: Date,
      lastUpdated: Date
    },
    {
      indexes: [
        {
          type: 'hash',
          fields: ['name']
        }
      ]
    }
  )

  /**
   * Unmarshal data coming from ArangoDB
   */
  Band.struct = {
    members: 'Member'
  }

  /**
   * Hooks allow you to modify the data before stored in database.
   * You have access to the model instance so properties can be invoked.
   */
  Band.hooks = {
    lastUpdated(model) {
      model.updated = Date.now()
    }
  }

  return orango.model('Band', Band)
}
