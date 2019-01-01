const sleep = require('../helpers/sleep')

module.exports = ({ orango }) => {
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
  User.schema = orango.schema(
    {
      active: Boolean,
      email: String,
      firstName: String,
      lastName: String,
      tags: [String],
      updated: Date,
      settings: orango.Types.Schema('Settings')
    },
    {
      // strict: false,
      // removeOnMatchDefault: true, // TODO: Finish
      indexes: [
        { type: 'hash', fields: ['active'] },
        { type: 'hash', fields: ['tags'] },
        { type: 'hash', fields: ['firstName', 'lastName'] }
      ]
    }
  )

  /**
   * Unmarshal data coming from ArangoDB
   */
  User.struct = {
    settings: 'Settings'
  }

  /**
   * Hooks allow you to modify the data before stored in database.
   * You have access to the model instance so properties can be invoked.
   */
  User.hooks = {
    async insert(model) {
      // console.log('before sleep'.yellow)
      // await sleep(1000)
      // console.log('before after'.green)
      model.created = Date.now()
      model.foo = 'bar' // invalid data will still be removed
    },
    async update(model) {
      model.updated = Date.now()
    }
  }

  return orango.model('User', User)
}
