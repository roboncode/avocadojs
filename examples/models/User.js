const orango = require('../../lib')
// const Device = require('./Device')
const Joi = require('joi')

let schema = orango.Schema(
  {
    authId: String,
    role: { type: String, valid: ['admin', 'user'], default: 'user' },
    screenName: String, // roboncode
    firstName: { type: String, regex: /^[A-Za-z\s']+$/, min: 3 },
    lastName: String,
    email: { type: String, email: {} },
    phone: String,
    location: String,
    desc: String,
    avatar: String, // URL to avatar image
    banner: String, // URL to background image
    theme: String, // #FF0000
    devices: [{ name: String }], // Ids used to send push notifications to
    // devices: [String], // Ids used to send push notifications to
    // // devices: [], // Ids used to send push notifications to
    // // devices: [ Device ], // Ids used to send push notifications to
    // // devices: [Device.schema], // Ids used to send push notifications to
    // // devices: [Device.schema.json], // Ids used to send push notifications to
    stats: {
      friends: {
        type: orango.Types.Any,
        default: 0
      },
      invites: {
        type: orango.Types.Any,
        default: 0
      },
      following: {
        type: orango.Types.Any,
        default: 0
      },
      followers: {
        type: orango.Types.Any,
        default: 0
      },
      messages: {
        type: orango.Types.Any,
        default: 0
      },
      posts: {
        type: orango.Types.Any,
        default: 0
      }
    },
    internalStats: {
      reports: {
        type: orango.Types.Any,
        default: 0
      }, // # of reports received
      reported: {
        type: orango.Types.Any,
        default: 0
      }, // # users reported
      blocks: {
        type: orango.Types.Any,
        default: 0
      }, // # mutes received
      blocked: {
        type: orango.Types.Any,
        default: 0
      } // # users muted
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

schema.statics.sayGoodbye = function() {
  this.emitter.emit('sayGoodbye')
}

schema.statics.getUserWithDevices = async function(id) {
  anguler.model('Device').schema
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

schema.methods.sayHello = function(day) {
  this.emitter.emit('sayHello', day, this.firstName + ' ' + this.lastName)
}

module.exports = orango.model('User', schema, 'users')
