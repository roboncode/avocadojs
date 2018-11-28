const orango = require('orango')
const human = require('humanparser')

let schema = orango.Schema({
  authId: String,
  role: {
    type: String,
    valid: ['admin', 'user'],
    default: 'user'
  },
  permissions: String, // will be populated
  screenName: String, // roboncode
  firstName: String,
  lastName: String,
  avatar: String, // URL to avatar image
  desc: String,
  settings: {
    banner: String, // URL to background image
    theme: String, // #FF0000,
    lang: {
      type: String,
      default: 'en-us'
    },
    timezone: {
      type: Number,
      default: -18000
    }
  },
  stats: {
    following: {
      type: orango.Types.Any,
      default: 0
    },
    followers: {
      type: orango.Types.Any,
      default: 0
    },
    tweets: {
      type: orango.Types.Any,
      default: 0
    },
    likes: {
      type: orango.Types.Any,
      default: 0
    }
  },
  created: Date,
  updated: {
    type: Date,
    default: Date.now
  }
}, {
  strict: true,
  removeOnMatchDefault: true,
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

schema.statics.newUser = async function (authId, name, email) {
  const attrs = human.parseName(name)
  let user = new this({
    authId: authId,
    firstName: attrs.firstName,
    lastName: attrs.lastName,
    email,
    screenName: email.replace(/(@\w+\.\w+)/gi, "").replace(/[._+]/gi, ""),
    created: Date.now()
  })
  await user.save().id()
  return await this.getUser(user.id)
}

schema.statics.getUser = async function (id) {
  const UserRole = orango.model('UserRole')
  return await this.findById(id)
    .id()
    .defaults(true)
    .populate('permissions', UserRole.findById('@@parent.role || "user"').select('permissions'), {
      merge: true
    })
}

schema.statics.findByAuthId = async function (authId) {
  const UserRole = orango.model('UserRole')
  return await this.findOne({
      authId
    })
    .id()
    .defaults(true)
    .populate('permissions', UserRole.findById('@@parent.role || "user"').select('permissions'), {
      merge: true
    })
}

schema.computed.fullName = function () {
  return this.firstName + ' ' + this.lastName
}

const User = orango.model('User', schema)

User.hasMany('Tweet') // many
User.hasMany('Comment') // many


module.exports = User