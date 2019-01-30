module.exports = ({ orango }) => {
  const { OPERATIONS, SCHEMA } = orango.consts

  class UserSchema extends orango.Schema {
    get fullName() {
      return (this.firstName + ' ' + this.lastName).trim()
    }
  }

  const schema = new UserSchema({
    active: Boolean,
    email: String,
    firstName: String,
    lastName: String,
    tags: [String],
    role: { type: String, default: 'user', defaultOnUpdate: 'admin' },
    created: { type: Date, default: Date.now },
    updated: { type: Date, defaultOnUpdate: Date.now },
    settings: 'Settings'
  })

  schema.addIndex(SCHEMA.INDEX.HASH, 'active')
  schema.addIndex(SCHEMA.INDEX.HASH, 'tags')
  schema.addIndex(SCHEMA.INDEX.HASH, ['firstName', 'lastName'])

  const User = orango.model('User', schema)

  User.on(OPERATIONS.INSERT, async model => {
    model.settings.custom.backgroundImage = '#FFCC00'
    model.foo = 'bar' // invalid data will stripped
  })

  return User
}
