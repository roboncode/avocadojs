const orango = require('../../lib')
const Custom = require('../models/Custom')({ orango })
const Settings = require('../models/Settings')({ orango })
const User = require('../models/User')({ orango })

beforeAll(async () => {
  User.init(orango)
})

test('update all', async () => {
  let aql = await User.update({ likes: 1 })
    .toAQL()
  aql = aql.replace(/"\d[\w-:.]+"/gi, '%DATE_HERE%')
  expect(aql).toBe(
    'FOR user IN users UPDATE user WITH {"likes":1,"updated":%DATE_HERE%} IN users'
  )
})

test('update where', async () => {
  let aql = await User
    .update({ likes: 1 })
    .where({ active: true })
    .toAQL()
  aql = aql.replace(/"\d[\w-:.]+"/gi, '%DATE_HERE%')
  expect(aql).toBe(
    'FOR user IN users FILTER user.`active` == true UPDATE user WITH {"likes":1,"updated":%DATE_HERE%} IN users'
  )
})

test('update where with return', async () => {
  let aql = await User.update({ likes: 1 })
    .where({ active: true })
    .return()
    .toAQL()
  aql = aql.replace(/"\d[\w-:.]+"/gi, '%DATE_HERE%')
  expect(aql).toBe(
    'FOR user IN users FILTER user.`active` == true UPDATE user WITH {"likes":1,"updated":%DATE_HERE%} IN users RETURN `NEW`'
  )
})