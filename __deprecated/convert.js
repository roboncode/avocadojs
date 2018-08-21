require('../models/User')
const tang = require('../tang')
const colorize = require('json-colorz')
require('colors')

console.log('===================================================='.grey)
;(async () => {
  let user = tang.convertTo(
    {
      bogus: true,
      daisy: 'chain',
      authId: '123',
      test: 1,
      firstName: 'Rob',
      lastName: 'Taylor',
      email: 'rob@obogo.io',
      // role: 'blah',
      stats: { friends: 12 },
      devices: [
        {
          token: '123'
        }
      ]
    },
    'User'
  )

  try {
    let data = await user.toObject({
      computed: true
      // noDefaults: true
    })
    colorize(data)
  } catch (e) {
    console.log('Error', e.message)
  }
})()
