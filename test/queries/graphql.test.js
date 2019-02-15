describe('graphql queries', () => {
  let orango, User

  beforeAll(async () => {
    orango = require('../../lib')
    require('../models/Custom')({ orango })
    require('../models/Settings')({ orango })
    User = require('../models/User')({ orango })
    User.init(orango) // force init for tests only
  })

  test('replace me', () => {
    expect(true).toBe(true)
  })

})

