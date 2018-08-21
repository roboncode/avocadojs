require('../models/User')
const builder = require('../tang/Builder')
const colorize = require('json-colorz')
const _pick = require('lodash/pick')
const _merge = require('lodash/merge')
require('colors')

console.log('===================================================='.grey)
;(async () => {
  builder.registry['pick'] = _pick
  builder.registry['merge'] = _merge

  builder
    .factory([
      {
        role: 'admin',
        lastName: 'Smith',
        likes: {
          riding: true,
          magic: true,
          programming: true
        }
      },
      {
        role: 'user',
        lastName: 'Taylor',
        stats: {
          friends: 123
        }
      }
    ])
    .merge({ firstName: 'Rob', bogus: true, likes: { test: false } })
    .pick(['firstName', 'lastName', 'likes.riding', 'bogus', 'stats', 'role'])
    .merge({ location: 'Highland' })
    .inspect('After location'.red)
    .convertTo('User')
    .toObject({ computed: true, noDefaults: false, unknownProps: 'strip' })
    .intercept((item, index) => {
      item._id = index
      return item
    })
    .exec(report => {
      console.log(report.grey)
    })
    .then(result => {
      colorize(result)
    })
})()
