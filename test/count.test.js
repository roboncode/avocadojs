describe('count queries', () => {
  let orango, User, MockCursor

  beforeAll(async () => {
    orango = require('./__mocks__/orango')
    MockCursor = require('./__mocks__/MockCursor')
    require('./models/Custom')({ orango })
    require('./models/Settings')({ orango })
    User = require('./models/User')({ orango })
    User.init(orango) // force init for tests only
  })

  beforeEach(async () => {
    MockCursor.returnVal = [10]
  })
   
  test('count', async () => {
    const query = User.count()

    const aql = await query.toAQL()
    expect(aql).toBe('FOR user IN users COLLECT WITH COUNT INTO length RETURN length')

    const result = await query.exec()
    expect(result).toBe(10)
  })
  
  test('count where', async () => {
    const query = User.count().where({ active: true })

    const aql = await query.toAQL()
    expect(aql).toBe('FOR user IN users FILTER user.`active` == true COLLECT WITH COUNT INTO length RETURN length')
  })
})
