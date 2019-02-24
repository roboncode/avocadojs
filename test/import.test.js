describe('import queries', () => {
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
    MockCursor.returnVal = [{ _id: "users/12345", _key: "12345", _rev: "_X7aFJNu--_", firstName: 'John', lastName: 'Smith' }]
  })

  test('import', async () => {
    let query = User.import({ firstName: 'John', lastName: 'Smith' })

    let aql = await query.toAQL()
    aql = aql.replace(/"\d[\w-:.]+"/gi, '%DATE_HERE%')
    expect(aql).toBe('FOR user IN [{"firstName": "John", "lastName": "Smith", "tags": [], "settings": {"custom": {"primaryColor": "#000000", "secondaryColor": "#000000", "backgroundImage": "#FFCC00"}}, "created": %DATE_HERE%}] INSERT user INTO users')

    let result = await query.exec()
    expect(result).toBeUndefined()
  })

  test('import return', async () => {
    let query = User.import({ firstName: 'John', lastName: 'Smith' }).return()

    let aql = await query.toAQL()
    aql = aql.replace(/"\d[\w-:.]+"/gi, '%DATE_HERE%')
    expect(aql).toBe('FOR user IN [{"firstName": "John", "lastName": "Smith", "tags": [], "settings": {"custom": {"primaryColor": "#000000", "secondaryColor": "#000000", "backgroundImage": "#FFCC00"}}, "created": %DATE_HERE%}] INSERT user INTO users RETURN `NEW`')

    let result = await query.exec()
    expect(result).toEqual(MockCursor.returnVal)
  })
})
