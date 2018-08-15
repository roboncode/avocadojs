const expect = require('chai').expect
const asyncForEach = require('../avocado/helpers/asyncForEach')
const clone = require('../avocado/helpers/clone')

describe('avocado helpers', () => {
  describe('asyncForEach an array', () => {
    it('should be asynchronous', async () => {
      let total = 0
      await asyncForEach([1, 2, 3], async (num, index, data) => {
        return new Promise(resolve => {
          total += num
          setTimeout(resolve)
        })
      })
      expect(total).to.equal(6)
    })
  })

  describe('asyncForEach an object', () => {
    it('should be asynchronous', async () => {
      let total = 0
      await asyncForEach({
        v1: 1,
        v2: 2,
        v3: 3
      }, async (item, key, data) => {
        return new Promise(resolve => {
          total += item
          setTimeout(resolve)
        })
      })
      expect(total).to.equal(6)
    })
  })

  describe('clone', () => {
    it('clone object', () => {
      let src = {
        a: [{
          a1: 1,
          b: true,
          c: {
            c1: 1
          },
          d: new Date(),
          e: /test/gi,
          f: function test() {},
          g: 'hello'
        }],
        b: true,
        c: {
          c1: 1
        },
        d: new Date(),
        e: /test/gi,
        f: function test() {},
        g: 'hello'
      }
      let copy = clone(src)
      expect(copy).to.deep.equal(src)
    })
  })
})