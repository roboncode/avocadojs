const orango = require('../../lib')
const Custom = require('../models/Custom')({ orango })
const Settings = require('../models/Settings')({ orango })
const User = require('../models/User')({ orango })

beforeAll(async () => {
  User.init(orango)
})

test('find all', async () => {
  const query = await User.find().toAQL()
  expect(query).toBe('FOR user IN users RETURN user')
})

test('find one', async () => {
  const query = await User.find().one().toAQL()
  expect(query).toBe('FOR user IN users LIMIT 1 RETURN user')
})

test('find where', async () => {
  const query = await User.find().where({ active: true }).toAQL()
  expect(query).toBe('FOR user IN users FILTER user.`active` == true RETURN user')
})

// TODO: Test with mock database
// test('find one as model', async () => {
//   const returnOpts = orango.return.model()
//   const query = await User.find().one().return(returnOpts).toAQL()
//   expect(query).toBe('FOR user IN users LIMIT 1 RETURN user')
// })
