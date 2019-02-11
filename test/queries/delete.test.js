const orango = require('../../lib')
const Custom = require('../models/Custom')({ orango })
const Settings = require('../models/Settings')({ orango })
const User = require('../models/User')({ orango })

beforeAll(async () => {
  User.init(orango)
})

test('delete all', async () => {
  const query = await User.remove().toAQL()
  expect(query).toBe('FOR user IN users REMOVE user IN users')
})

test('delete one', async () => {
  const query = await User.remove().one().toAQL()
  expect(query).toBe('FOR user IN users LIMIT 1 REMOVE user IN users RETURN `OLD`')
})

test('delete where', async () => {
  const query = await User.remove()
    .where({ active: false })
    .toAQL()
  expect(query).toBe(
    'FOR user IN users FILTER user.`active` == false REMOVE user IN users'
  )
})

