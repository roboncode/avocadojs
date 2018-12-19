let expect = require('chai').expect
let arrayOverride = require('../lib/helpers/arrayOverride')
let convertToSnakecase = require('../lib/helpers/convertToSnakecase')
let createDefaultTree = require('../lib/helpers/createDefaultTree')
let createUniqueId = require('../lib/helpers/createUniqueId')
let mergeDefaultTree = require('../lib/helpers/mergeDefaultTree')
let parseArrayPaths = require('../lib/helpers/parseArrayPaths')
let setDefaultsToNull = require('../lib/helpers/setDefaultsToNull')
let sortToAQL = require('../lib/helpers/sortToAQL')
let objectToArray = require('../lib/helpers/objectToArray')

describe('orango helpers', function() {
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

  describe('arrayOverride', function() {
    it('[].push(1)', function() {
      let arr = arrayOverride()
      arr.push(1)
      expect(arr.length).to.equal(1)
      expect(arr).to.deep.equal([1])
    })
  })

  describe('arrayOverride', function() {
    it('[].push([{}])', function() {
      let arr = arrayOverride()
      arr.push({})
      expect(arr.length).to.equal(1)
      expect(arr).to.deep.equal([{}])
      expect(arr[0].isNew).to.equal(true)
    })
  })

  describe('arrayOverride', function() {
    it('[].splice(0, 1)', function() {
      let arr = arrayOverride()
      arr.push(1, 2, 3)
      arr.splice(0, 1)
      expect(arr.length).to.equal(2)
      expect(arr).to.deep.equal([2, 3])
    })
  })

  describe('arrayOverride', function() {
    it('[].pull(1, 2)', function() {
      let arr = arrayOverride()
      arr.pull(1, 2)
      expect(arr.pulls).to.deep.equal([1, 2])
    })
  })

  describe('convertToSnakecase', function() {
    it('converts to snakecase without uppercase', function() {
      let str = convertToSnakecase('test')
      expect(str).to.equal('test')
    })
  })

  describe('convertToSnakecase', function() {
    it('converts to snakecase with uppercase', function() {
      let str = convertToSnakecase('TestOne')
      expect(str).to.equal('test_one')
    })
  })

  describe('createDefaultTree', function() {
    it('create a default tree', function() {
      let tree = createDefaultTree(data)
      expect(tree).to.deep.equal({
        devices: [],
        stats: { friends: [] }
      })
    })
  })

  describe('createUniqueId', function() {
    it('should create a unique id', function() {
      let uid_1 = createUniqueId()
      let uid_2 = createUniqueId()
      expect(uid_1).to.not.equal(uid_2)
    })
  })

  describe('objectToArray with object', function() {
    it('should convert object to array', function() {
      let items = objectToArray({
        john: { name: 'John' },
        jane: { name: 'Jane' }
      })
      expect(items).to.deep.equal([
        {
          _key: 'john',
          name: 'John'
        },
        {
          _key: 'jane',
          name: 'Jane'
        }
      ])
    })
  })

  describe('objectToArray with array', function() {
    it('should use existing array', function() {
      let src = [
        {
          _key: 'john',
          name: 'John'
        },
        {
          _key: 'jane',
          name: 'Jane'
        }
      ]
      let items = objectToArray(src)
      expect(items).to.equal(src)
    })
  })

  describe('parseArrayPaths', function() {
    it('should create an array of paths', function() {
      let data = { foo: [], bar: { baz: [] } }
      let paths = parseArrayPaths(data)
      expect(paths).to.deep.equal(['foo', 'bar.baz'])
    })
  })

  describe('mergeDefaultTree', function() {
    it('merge tree with default values', function() {
      let model = {}
      let defaults = { foo: [], bar: { baz: [] } }
      mergeDefaultTree(model, defaults)
      expect(model).to.deep.equal({ foo: [], bar: { baz: [] } })
    })
  })

  describe('setDefaultsToNull', function() {
    it('set default values to null', async function() {
      let result = await setDefaultsToNull(
        {
          a: 1,
          b: { b1: 1, b2: 2 },
          c: [1, 2],
          d: [{ d1: 1, d2: 2 }],
          e: 2
        },
        {
          a: 1,
          b: { b1: 1, b2: 1 },
          c: [1, 1],
          d: [{ d1: 1, d2: 1 }],
          e: 1
        }
      )
      expect(result).to.deep.equal({
        a: null,
        b: { b1: null, b2: 2 },
        c: [null, 2],
        d: [{ d1: null, d2: 2 }],
        e: 2
      })
    })
  })

  describe('sortToAQL with string', function() {
    let sortStr = 'lastName firstName -id'
    let aql = sortToAQL(sortStr, 'doc')
    it('should convert to aql', function() {
      expect(aql).to.equal('doc.lastName, doc.firstName, doc.id DESC')
    })
  })

  describe('sortToAQL with string', function() {
    let aql = sortToAQL(
      {
        lastName: 1,
        firstName: 1,
        id: -1
      },
      'doc'
    )
    it('should convert to aql', function() {
      expect(aql).to.equal('doc.lastName, doc.firstName, doc.id DESC')
    })
  })
})
