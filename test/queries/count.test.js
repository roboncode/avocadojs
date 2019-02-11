const orango = require('../../lib')
const Custom = require('../models/Custom')({ orango })
const Settings = require('../models/Settings')({ orango })
const User = require('../models/User')({ orango })

beforeAll(async () => {
  User.init(orango)
})

test('count', async () => {
  const query = await User.count().toAQL()
  expect(query).toBe('FOR user IN users COLLECT WITH COUNT INTO length RETURN length')
})

test('count where', async () => {
  const query = await User.count().where({ active: true }).toAQL()
  expect(query).toBe('FOR user IN users FILTER user.`active` == true COLLECT WITH COUNT INTO length RETURN length')
})
