const AvocadoSchema = require('../avocado/schemas/ArangoSchema')
const colorize = require('json-colorz')
require('colors')

console.log('===================================================='.grey)
;(async () => {
  const schema = new AvocadoSchema({
    name: String,
    type: { type: String, default: 'User' },
    createdAt: { type: Date, default: Date.now }
  })

  let data = await schema.validate(
    {
      _key: 'myKey',
      name: 'Rob Taylor',
      bogus: true
    },
    {
      stripUnknown: true
    }
  )
  colorize(data)
})()
