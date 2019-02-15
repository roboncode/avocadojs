describe('insert queries', () => {
  let orango, User, MockCursor

  beforeAll(async () => {
    orango = require('../__mocks__/orango')
    MockCursor = require('../__mocks__/MockCursor')
    require('../models/Custom')({ orango })
    require('../models/Settings')({ orango })
    User = require('../models/User')({ orango })
    User.init(orango) // force init for tests only
  })

  beforeEach(async () => {
    MockCursor.returnVal = [{ _id: "users/12345", _key: "12345", _rev: "_X7aFJNu--_", firstName: 'John', lastName: 'Smith' }]
  })

  test('insert', async () => {
    let query = User.insert({firstName: 'John', lastName: 'Smith'})
    
    let aql = await query.toAQL()
    aql = aql.replace(/"\d[\w-:.]+"/gi, '%DATE_HERE%')
    expect(aql).toEqual('INSERT {"firstName": "John", "lastName": "Smith", "tags": [], "settings": {"custom": {"primaryColor": "#000000", "secondaryColor": "#000000", "backgroundImage": "#FFCC00"}}, "created": %DATE_HERE%} INTO users')

    let result = await query.exec()
    expect(result).toBeUndefined()
  })

  test('insert with return', async () => {
    let query = User.insert({ firstName: 'John', lastName: 'Smith' }).return({one: true})

    let aql = await query.toAQL()
    aql = aql.replace(/"\d[\w-:.]+"/gi, '%DATE_HERE%')
    expect(aql).toEqual('INSERT {"firstName": "John", "lastName": "Smith", "tags": [], "settings": {"custom": {"primaryColor": "#000000", "secondaryColor": "#000000", "backgroundImage": "#FFCC00"}}, "created": %DATE_HERE%} INTO users RETURN `NEW`')

    let result = await query.exec()
    expect(result).toEqual({ "_id": "users/12345", "_key": "12345", "_rev": "_X7aFJNu--_", "firstName": "John", "lastName": "Smith" })
  })

  test('save', async () => {
    let user = new User({ firstName: 'John', lastName: 'Smith' })

    await user.save()

    expect(user.fullName).toBe('John Smith')

    expect(user.toJSON()).toEqual({ "_id": "users/12345", "_key": "12345", "_rev": "_X7aFJNu--_", "firstName": "John", "fullName": "John Smith", "lastName": "Smith" })
  })
})
