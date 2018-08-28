/**
 * Schemas are a JSON representation of Joi schemas. You can use 
 * Joi within the JSON to handle custom definitions. You will see
 * that almost everythin can be handles via JSON.
 */
const orango = require('../../lib')
let schema = orango.Schema(
  {
    role: { type: String, valid: ['admin', 'user'], default: 'user' },
    screenName: String, // @foobar
    firstName: { type: String, regex: /^[A-Za-z\s']+$/, min: 3 },
    lastName: String,
    email: { type: String, email: {} },
    knownDevices: [{ $id: String, name: String }],
    tags: [String],
    stats: {
      following: {
        type: orango.Types.Any,
        default: 0
      },
      followers: {
        type: orango.Types.Any,
        default: 0
      },
      posts: {
        type: orango.Types.Any,
        default: 0
      }
    },
    settings: {
      lang: { type: String, default: 'en-us' },
      timezone: { type: Number, default: -18000 }
    },
    createdAt: { type: Date },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    strict: true,
    removeOnMatchDefault: true,
    // TODO: autoIndex: true,
    indexes: [
      {
        type: 'hash',
        fields: ['authId']
      },
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

schema.computed.fullName = function() {
  return this.firstName + ' ' + this.lastName
}

schema.computed.id = function() {
  return this._key
}

schema.statics.getUserWithDevices = async function(id) {
  orango.model('Device').schema
  return await User.findByQuery(
    `FOR device IN devices
        FILTER device._key == '${id}'
          FOR @@doc IN @@collection
            FILTER device.user == @@doc._key`,
    { noDefaults: false }
  )
    .computed(true)
    .exec()
}

schema.methods.sayHi = function(day) {
  this.emitter.emit(`Hi, my name is ${this.firstName}.`)
}

// You can override the default collection name in the last param
module.exports = orango.model('User', schema/*, 'users'*/)
