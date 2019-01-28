module.exports = ({ orango }) => {
  const { OPERATIONS } = orango.consts

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
    role: { type: String, onInsert: 'user', onUpdate: 'admin' },
    created: { type: Date, onInsert: Date.now },
    updated: { type: Date, onUpdate: Date.now },
    settings: 'Settings' 
  })

  schema.addIndex('hash', 'active')
  schema.addIndex('hash', 'tags')
  schema.addIndex('hash', ['firstName', 'lastName'])

  const User = orango.model('User', schema)

  User.on(OPERATIONS.INSERT, async model => {
    model.foo = 'bar' // invalid data will stripped
  })

  return User
}
