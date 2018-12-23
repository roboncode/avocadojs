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
   * Validates data going to Ara1ngoDB
   */
  User.schema = orango.Schema(
    {
      email: String,
      screenName: String,
      firstName: String,
      lastName: String
    },
    {
      strict: true,
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

  return orango.model('User', User)
}
