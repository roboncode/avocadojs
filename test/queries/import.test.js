const orango = require('../../lib')
const Custom = require('../models/Custom')({ orango })
const Settings = require('../models/Settings')({ orango })
const User = require('../models/User')({ orango })

beforeAll(async () => {
  User.init(orango)
})

test('replace me', () => {
  expect(true).toBe(true)
})