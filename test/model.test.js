// const MockOrango = require('./mocks/MockOrango')
const Orango = require('../lib/Orango')

function getUserModel() {
  let orango = new Orango()

  class User extends orango.Model {
    constructor(data = {}) {
      super(data, User.schema)
    }

    get fullName() {
      return ((this.firstName || '') + ' ' + (this.lastName || '')).trim()
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
      updated: Date
    },
    {
      // strict: false,
      // removeOnMatchDefault: true, // TODO: Deprecated???
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
    insert(model) {
      model.firstName = model.firstName || ''
      model.lastName = model.lastName || ''
      model.created = Date.now()
      model.foo = 'bar' // invalid data will still be removed
    },
    update(model) {
      model.updated = Date.now()
    }
  }

  return orango.model('User', User)
}

test('register a Model with orango', () => {
  let Model = getUserModel()
  expect(Model.name).toBe('User')
})

test('create instance of Model', () => {
  let Model = getUserModel()
  let inst = new Model({
    firstName: 'John',
    lastName: 'Smith'
  })
  expect(inst.firstName).toBe('John')
  expect(inst.lastName).toBe('Smith')
  expect(inst.fullName).toBe('John Smith')
  expect(inst.tags).toMatchObject([])
  expect(JSON.stringify(inst)).toBe(
    '{"firstName":"John","lastName":"Smith","tags":[],"fullName":"John Smith"}'
  )
})

test('create instance of Model', () => {
  let Model = getUserModel()
  let inst = new Model({
    fullName: 'John Smith'
  })
  expect(JSON.stringify(inst)).toBe(
    '{"tags":[],"fullName":""}'
  )
})

test('create instance of Model from JSON', () => {
  let User = getUserModel()
  let user = User.fromJSON({
    firstName: 'John',
    lastName: 'Smith'
  })
  expect(user).toBeInstanceOf(User)
})
