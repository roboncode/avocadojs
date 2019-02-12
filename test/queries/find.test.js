const MockOrango = require('../mocks/MockOrango')
const MockCursor = require('../mocks/MockCursor')
let Custom, Settings, User

beforeAll(async () => {
  const orango = MockOrango.get()
  Custom = require('../models/Custom')({ orango })
  Settings = require('../models/Settings')({ orango })
  User = require('../models/User')({ orango })
})

beforeEach(async() => {
  MockCursor.returnVal = []
})

test('find all', async () => {
  const aql = await User.find().toAQL()
  expect(aql).toBe('FOR user IN users RETURN user')
})

test('find one', async () => {
  const aql = await User.find().one().toAQL()
  expect(aql).toBe('FOR user IN users LIMIT 1 RETURN user')
})

test('find where', async () => {
  const aql = await User.find().where({ active: true }).toAQL()
  expect(aql).toBe('FOR user IN users FILTER user.`active` == true RETURN user')
})

test('find one as model', async () => {
  MockCursor.returnVal = [{firstName: 'John', lastName: 'Smith'}]

  const orango = MockOrango.get()
  const returnOpts = orango.return.model()
  const query = User.find().one().return(returnOpts)
  
  let aql = await query.toAQL()
  expect(aql).toBe('FOR user IN users LIMIT 1 RETURN user')

  let result = await query.exec()
  expect(result[0]).toBeInstanceOf(User)
  expect(result).toEqual(MockCursor.returnVal)
  expect(result[0].fullName).toBe('John Smith')
})
