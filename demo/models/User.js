const arango = require('../../arango')
const Device = require('./Device')

let schema = arango.Schema({
  authId: String,
  role: { type: String, valid: ['admin', 'user'], default: 'user' },
  screenName: String, // roboncode
  firstName: { type: String, regex: /^[A-Za-z\s']+$/, min: 3 },
  lastName: String,
  test: { type: Number, min: 1, max: 10 },
  email: { type: String, email: {} },
  phone: String,
  location: String,
  desc: String,
  avatar: String, // URL to avatar image
  banner: String, // URL to background image
  theme: String, // #FF0000
  devices: [ Device ], // Ids used to send push notifications to
  // devices: [Device.schema], // Ids used to send push notifications to
  // devices: [Device.schema.json], // Ids used to send push notifications to
  stats: {
    friends: { type: Number, default: 0 },
    invites: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
    posts: { type: Number, default: 0 }
  },
  internalStats: {
    reports: { type: Number, default: 0 }, // # of reports received
    reported: { type: Number, default: 0 }, // # users reported
    blocks: { type: Number, default: 0 }, // # mutes received
    blocked: { type: Number, default: 0 } // # users muted
  },
  settings: {
    lang: { type: String, default: 'en-us' },
    timezone: { type: Number, default: -18000 }
  },
  createdAt: Date,
  updatedAt: { type: Date, default: Date.now }
}, {
  strict: true,
  indexes: [{
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
})

schema.computed.fullName = function() {
  return this.firstName + ' ' + this.lastName
}

schema.statics.sayGoodbye = function() {
  this.emitter.emit('sayGoodbye')
}

schema.methods.sayHello = function(day) {
  this.emitter.emit('sayHello', day, this.firstName + ' ' + this.lastName)
}

module.exports = arango.model('User', schema, 'users')
