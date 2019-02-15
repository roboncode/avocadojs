describe('update queries', () => {
  let orango, User

  beforeAll(async () => {
    orango = require('../../lib')
    require('../models/Custom')({ orango })
    require('../models/Settings')({ orango })
    User = require('../models/User')({ orango })
    User.init(orango) // force init for tests only
  })

  test('update all', async () => {
    let aql = await User.update({ likes: 1 }).toAQL()
    aql = aql.replace(/"\d[\w-:.]+"/gi, '%DATE_HERE%')
    expect(aql).toEqual(
      'FOR user IN users UPDATE user WITH {"likes":1,"settings":{"custom":{"primaryColor":"#999"}},"updated":%DATE_HERE%} IN users'
    )
  })

  test('update where', async () => {
    let aql = await User.update({ likes: 1 })
      .where({ active: true })
      .toAQL()
    aql = aql.replace(/"\d[\w-:.]+"/gi, '%DATE_HERE%')
    expect(aql).toBe(
      'FOR user IN users FILTER user.`active` == true UPDATE user WITH {"likes":1,"settings":{"custom":{"primaryColor":"#999"}},"updated":%DATE_HERE%} IN users'
    )
  })

  test('update where with return', async () => {
    let aql = await User.update({ likes: 1 })
      .where({ active: true })
      .return()
      .toAQL()
    aql = aql.replace(/"\d[\w-:.]+"/gi, '%DATE_HERE%')
    expect(aql).toBe(
      'FOR user IN users FILTER user.`active` == true UPDATE user WITH {"likes":1,"settings":{"custom":{"primaryColor":"#999"}},"updated":%DATE_HERE%} IN users RETURN `NEW`'
    )
  })
})
