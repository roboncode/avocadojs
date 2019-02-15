
describe('delete queries', () => {
  let orango, User

  beforeAll(async () => {
    orango = require('../../lib')
    require('../models/Custom')({ orango })
    require('../models/Settings')({ orango })
    User = require('../models/User')({ orango })
    User.init(orango) // force init for tests only
  })

  test('delete all', async () => {
    const query = User.remove()

    const aql = await query.toAQL()
    expect(aql).toBe('FOR user IN users REMOVE user IN users')
  })

  test('delete one', async () => {
    const query = User.remove().one()

    const aql = await query.toAQL()
    expect(aql).toBe('FOR user IN users LIMIT 1 REMOVE user IN users RETURN `OLD`')
  })

  test('delete where', async () => {
    const query = User.remove().where({ active: false })
    
    const aql = await query.toAQL()
    expect(aql).toBe('FOR user IN users FILTER user.`active` == false REMOVE user IN users')
  })
})
