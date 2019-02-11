module.exports = ({ orango }) => {
  const { OPERATIONS, SCHEMA } = orango.consts

  class UserSchema extends orango.Schema {
    get fullName() {
      return (this.firstName + ' ' + this.lastName).trim()
    }
  }

  const schema = new UserSchema({
    active: Boolean,
    firstName: String,
    lastName: String,
    likes: Number,
    tags: [ String ], 
    // settings: 'Settings',
    created: { type: Date, default: Date.now },
    updated: { type: Date, defaultOnUpdate: Date.now },
  })

  const User = orango.model('User', schema)

  User.findById = async function (id) {
    return await this.find().byId(id)
  }

  User.on(OPERATIONS.INSERT, async model => {
    model.settings.custom.backgroundImage = '#FFCC00'
    model.foo = 'bar' // invalid data will stripped
  })

  return User
}
