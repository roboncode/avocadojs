const Schema = require('../tang/Schema')
const colorize = require('json-colorz')
require('colors')

console.log('===================================================='.grey)
;(async () => {
  const schema = new Schema({
    name: String,
    type: { type: String, valid: ['admin', 'user'], default: 'user' },
    gender: { type: String, default: 'other' },
    // devices: [
    //   {
    //     name: String
    //   }
    // ],
    devices: [{ name: String, kind: { type: String, default: 'junk' } }], // Ids used to send push notifications to
    stats: {
      followers: {
        type: Number,
        default: 0
      },
      friends: {
        type: Number,
        default: 0
      }
    },
    // createdAt: { type: Date, default: Date.now }
  })

  let data = await schema.validate(
    {
      _key: 'myKey',
      name: 'Rob Taylor',
      type: 'admin',
      bogus: true,
      devices: [{
        // _key: 'chrome',
        // token: 'abc'
      }],
      stats: {
        friends: 1
      }
    },
    {
      stripUnknown: true
    }
  )
  colorize(data)
})()
