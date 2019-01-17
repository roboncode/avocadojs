// const sleep = require('../helpers/sleep')

module.exports = ({ orango }) => {
  const { OPERATIONS } = orango.consts

  class UserSchema extends orango.Schema {
    constructor(json, options = {}) {
      super(json, options)
    }

    get fullName() {
      return (this.firstName + ' ' + this.lastName).trim()
    }

    toJSON() {
      return Object.assign({}, this, { fullName: this.fullName })
    }
  }

  const schema = new UserSchema({
    active: Boolean,
    email: String,
    firstName: String,
    lastName: String,
    tags: [String],
    role: { type: String, onInsert: 'user', onUpdate: 'admin'},
    created: { type: Date, onInsert: Date.now },
    updated: { type: Date, onUpdate: Date.now },
    // settings: orango.types.Schema('Settings')
  })

  schema.addIndex('hash', 'active')
  schema.addIndex('hash', 'tags')
  schema.addIndex('hash', ['firstName', 'lastName'])
  schema.strict(false)

  // schema.struct({ settings: 'Settings' })

  const User = orango.model('User', schema)

  // User.on(OPERATIONS.INSERT, async model => {
  //   model.created = Date.now()
  //   model.foo = 'bar' // invalid data will stripped
  // })

  // User.on(OPERATIONS.UPDATE, async model => {
  //   model.updated = Date.now()
  // })

  return User
}
