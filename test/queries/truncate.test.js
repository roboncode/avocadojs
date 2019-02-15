describe('find queries', () => {

  let orango, User

  beforeAll(async () => {
    orango = require('../__mocks__/orango')
    require('../models/Custom')({ orango })
    require('../models/Settings')({ orango })
    User = require('../models/User')({ orango })
    User.init(orango) // force init for tests only
  })

  test('replace me', async () => {
    expect(true).toBeTruthy()
  })

})
