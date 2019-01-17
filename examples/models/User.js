// const sleep = require('../helpers/sleep')

module.exports = ({ orango }) => {
  class UserSchema extends orango.Schema {
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
    // role: { type: String, onInsert: 'user' },
    // created: { type: Date, onInsert: Date.now },
    // updated: { type: Date, onUpdate: Date.now },
    // settings: orango.types.Schema('Settings')
  })

  schema.addIndex('hash', 'active')
  schema.addIndex('hash', 'tags')
  schema.addIndex('hash', ['firstName', 'lastName'])
  schema.strict(false)

  // schema.struct({ settings: 'Settings' })

  schema.on('insert', async model => {
    console.log('onInsert~~~~~~~~~~~~~~~~~~~~~'.bgMagenta)
    model.created = Date.now()
    model.foo = 'bar' // invalid data will still be removed
  })

  schema.on('update', async model => {
    model.updated = Date.now()
  })

  return orango.model('User', schema)
}
