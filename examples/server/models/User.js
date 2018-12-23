module.exports = orango => {
  class User extends orango.Model {
    constructor(data) {
      super(data, User.schema)
      this.firstName = "Steve"
      this.lastName = "Vai"
      if (data) {
        Object.assign(this, data)
      }
    }

    get fullName() {
      return (this.firstName + ' ' + this.lastName).trim()
    }

    // toJSON() {
    //   return Object.assign({}, this, { isHuman: this.isHuman })
    // }
  }

  /**
   * Validates data going to Ara1ngoDB
   */
  User.schema = orango.Schema(
    {
      firstName: String,
      lastName: String
    },
    {
      strict: true
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