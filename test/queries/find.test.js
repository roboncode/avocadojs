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

  MockCursor.returnVal = [{ firstName: 'John', lastName: 'Smith' }]
  
  const query = User.find().one()
  const aql = await query.toAQL()
  expect(aql).toBe('FOR user IN users LIMIT 1 RETURN user')

  const result = await query.exec()
  expect(result).toEqual(MockCursor.returnVal[0])
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

test('find sort with string', async () => {
  const query = User.find().sort('-lastName firstName')

  let aql = await query.toAQL()
  expect(aql).toBe('FOR user IN users SORT user.lastName DESC, user.firstName RETURN user')
})

// test('find sort with object', async () => {
//   const query = User.find().sort({
//     lastName: -1,
//     firstName: 1
//   })

//   let aql = await query.toAQL()
//   expect(aql).toBe('FOR user IN users SORT user.lastName DESC, user.firstName RETURN user')
// })

test('find by id', async () => {
  const query = User.find().byId('12345')

  let aql = await query.toAQL()
  expect(aql).toEqual('FOR user IN users FILTER user.`_key` == "12345" RETURN user')
})

test('find with limit and offset', async () => {
  const query = User.find().limit(10).offset(100)

  let aql = await query.toAQL()
  expect(aql).toEqual('FOR user IN users LIMIT 100, 10 RETURN user')
})
