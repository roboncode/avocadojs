let arrayOverride = require('../lib/helpers/arrayOverride')
let convertToSnakecase = require('../lib/helpers/convertToSnakecase')
let createDefaultTree = require('../lib/helpers/createDefaultTree')
let mergeDefaultTree = require('../lib/helpers/mergeDefaultTree')
let parseArrayPaths = require('../lib/helpers/parseArrayPaths')
let setDefaultsToNull = require('../lib/helpers/setDefaultsToNull')

test('arrayOverride [].push(1)', () => {
  let arr = arrayOverride()
  arr.push(1)
  expect(arr.length).toBe(1)
  expect(arr).toEqual([1])
})

test('arrayOverride [].push([{}])', () => {
  let arr = arrayOverride()
  arr.push({})
  expect(arr.length).toBe(1)
  expect(arr).toEqual([{}])
  expect(arr[0].isNew).toBe(true)
})

test('arrayOverride [].splice(0, 1)', () => {
  let arr = arrayOverride()
  arr.push(1, 2, 3)
  arr.splice(0, 1)
  expect(arr.length).toBe(2)
  expect(arr).toEqual([2, 3])
})

test('arrayOverride [].pull(1, 2)', () => {
  let arr = arrayOverride()
  arr.pull(1, 2)
  expect(arr.pulls).toEqual([1, 2])
})

test('convertToSnakecase should convert to snakecase without uppercase', () => {
  let str = convertToSnakecase('test')
  expect(str).toBe('test')
})

test('convertToSnakecase should convert to snakecase with uppercase', () => {
  let str = convertToSnakecase('TestOne')
  expect(str).toBe('test_one')
})

test('createDefaultTree should create a default tree', () => {
  let data = {
    authId: String,
    role: { type: String, valid: ['admin', 'user'], default: 'user' },
    devices: [{ name: String }],
    stats: {
      friends: [
        {
          type: Number,
          default: 0
        }
      ]
    }
  }
  let tree = createDefaultTree(data)
  expect(tree).toEqual({
    devices: [],
    stats: { friends: [] }
  })
})

test('parseArrayPaths should create an array of paths', () => {
  let data = { foo: [], bar: { baz: [] } }
  let paths = parseArrayPaths(data)
  expect(paths).toEqual(['foo', 'bar.baz'])
})

test('mergeDefaultTree should merge tree with default values', () => {
  let model = {}
  let defaults = { foo: [], bar: { baz: [] } }
  mergeDefaultTree(model, defaults)
  expect(model).toEqual({ foo: [], bar: { baz: [] } })
})

test('setDefaultsToNull should set default values to null', async () => {
  let result = await setDefaultsToNull(
    { a: 1, b: { b1: 1, b2: 2 }, c: [1, 2], d: [{ d1: 1, d2: 2 }], e: 2 },
    { a: 1, b: { b1: 1, b2: 1 }, c: [1, 1], d: [{ d1: 1, d2: 1 }], e: 1 }
  )
  expect(result).toEqual({
    a: null,
    b: { b1: null, b2: 2 },
    c: [null, 2],
    d: [{ d1: null, d2: 2 }],
    e: 2
  })
})

test('sortToAQL with string should convert to aql', () => {
  let sortStr = 'lastName firstName -id'
  let aql = sortToAQL(sortStr, 'doc')
  expect(aql).toBe('doc.lastName, doc.firstName, doc.id DESC')
})

test('sortToAQL with string should convert to aql', () => {
  let aql = sortToAQL({ lastName: 1, firstName: 1, id: -1 }, 'doc')
  expect(aql).toBe('doc.lastName, doc.firstName, doc.id DESC')
})
