describe('queries count', () => {
  beforeAll(async () => {
    const orango = require('../__mocks__/orango')

    require('../models/Custom')({ orango })
    require('../models/Settings')({ orango })
    const User = require('../models/User')({ orango })
    await User.ready()
  })
   
  test('count', async () => {
    const orango = require('../__mocks__/orango')
    const User = orango.model('User')
    const query = await User.count().toAQL()
    expect(query).toBe('FOR user IN users COLLECT WITH COUNT INTO length RETURN length')
  })
  
  test('count where', async () => {
    const orango = require('../__mocks__/orango')
    const User = orango.model('User')
    const query = await User.count().where({ active: true }).toAQL()
    expect(query).toBe('FOR user IN users FILTER user.`active` == true COLLECT WITH COUNT INTO length RETURN length')
  })
})
