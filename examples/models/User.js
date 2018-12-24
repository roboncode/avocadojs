module.exports = orango => {
  class User extends orango.Model {
    constructor(data) {
      super(data, User.schema)
    }

    get fullName() {
      return (this.firstName + ' ' + this.lastName).trim()
    }

    toJSON() {
      return Object.assign({}, this, { fullName: this.fullName })
    }
  }

  /**
   * Validates data going to ArangoDB
   */
  User.schema = orango.Schema(
    {
      email: String,
      screenName: String,
      firstName: String,
      lastName: String,
      created: Date,
      updated: Date
    },
    {
      // strict: false,
      // removeOnMatchDefault: true, // TODO: Deprecated???
      indexes: [
        {
          type: 'hash',
          fields: ['email']
        },
        {
          type: 'hash',
          fields: ['screenName']
        },
        {
          type: 'skipList',
          fields: ['screenName']
        },
        {
          type: 'skipList',
          fields: ['firstName']
        },
        {
          type: 'skipList',
          fields: ['lastName']
        }
      ]
    }
  )

  /**
   * Unmarshal data coming from ArangoDB
   */
  User.struct = {
    settings: 'Settings',
    tags: ['Tag']
  }

  /**
   * Hooks allow you to modify the data before stored in database.
   * You have access to the model instance so properties can be invoked.
   */
  User.hooks = {
    insert(model) {
      model.created = Date.now()
      model.foo = 'bar' // invalid data will still be removed
    },
    update(model) {
      model.updated = Date.now()
    }
  }

  return orango.model('User', User)
}
