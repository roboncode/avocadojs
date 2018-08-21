const expect = require('chai').expect
const asyncForEach = require('../tang/helpers/asyncForEach')
const clone = require('../tang/helpers/clone')
const definePrivateProperty = require('../tang/helpers/definePrivateProperty')
const difference = require('../tang/helpers/difference')
// const getObjectKeys = require('../tang/helpers/getObjectKeys')
const jsonStringify = require('../tang/helpers/jsonStringify')
const resolve = require('../tang/helpers/resolve')

describe('tang helpers', function() {
  describe('asyncForEach an array', function() {
    it('should be asynchronous', async function() {
      let total = 0
      await asyncForEach([1, 2, 3], async function(num, index, data) {
        return new Promise(function(resolve) {
          total += num
          setTimeout(resolve)
        })
      })
      expect(total).to.equal(6)
    })
  })

  describe('asyncForEach an object', function() {
    it('should be asynchronous', async function() {
      let total = 0
      await asyncForEach(
        {
          v1: 1,
          v2: 2,
          v3: 3
        },
        async function(item, key, data) {
          return new Promise(function(resolve) {
            total += item
            setTimeout(resolve)
          })
        }
      )
      expect(total).to.equal(6)
    })
  })

  describe('clone', function() {
    it('clone object', function() {
      let src = {
        a: [
          {
            a1: 1,
            b: true,
            c: {
              c1: 1
            },
            d: new Date(),
            e: /test/gi,
            f: function test() {},
            g: 'hello'
          }
        ],
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

  describe('definePrivateProperty', function() {
    it('should create a property that is not enumerable', function() {
      let o = {
        name: 'Rob'
      }
      definePrivateProperty(o, 'message', 'Hello, world!')
      let keys = Object.keys(o)
      expect(keys).to.contain('name')
      expect(keys).not.to.contain('message')
    })
  })

  describe('difference', function() {
    it('should return the difference between two objects', function() {
      let now = Date.now()
      let a = {
        name: 'John',
        age: 24,
        gender: 'M',
        created: now
      }
      let b = {
        name: 'Jane',
        age: 24,
        gender: 'F',
        created: now
      }
      let result = difference(a, b)
      expect(result).to.deep.equal({
        name: 'John',
        gender: 'M'
      })
    })
  })

  // describe('getObjectKeys', function() {
  //   it('should return fullpath object keys', function() {
  //     let a = {
  //       b: {
  //         f: 1,
  //         c: {
  //           d: 1
  //         }
  //       },
  //       g: 1
  //     }
  //     let keys = getObjectKeys(a)
  //     console.log('#keys', keys)
  //   })
  // })

  describe('JSON.stringify vs jsonStringify with circular reference', function() {
    function Foo() {
      this.message = 'Hello'
      this.circular = this
    }

    var foo = new Foo()

    describe('JSON.stringify', function() {
      it('should throw circular reference error', function() {
        let fn = function() {
          return JSON.stringify(foo)
        }
        expect(fn).to.throw('circular')
      })
    })

    describe('jsonStringify', function() {
      it('should convert to string', function() {
        expect(jsonStringify(foo)).to.equal('{"message":"Hello"}')
      })
    })
  })

  describe('resolve', function() {
    let data = {
      blog: {
        id: 1,
        text: 'My First Blog'
      },
      comments: [
        {
          name: 'John',
          text: 'Hello, world!'
        },
        {
          name: 'Jane',
          text: 'hi'
        }
      ]
    }

    describe('get', function() {
      let rdata = resolve(clone(data))
      describe('blog.id', function() {
        it('should be 1', function() {
          expect(rdata.get('blog.id')).to.equal(1)
        })
      })

      describe('comments[1].name', function() {
        it('should be "Jane"', function() {
          expect(rdata.get('comments.1.name')).to.equal('Jane')
        })
      })
    })

    describe('set', function() {
      let rdata = resolve(clone(data))
      describe('set blog.id to "This is a test"', function() {
        rdata.set('blog.text', 'This is a test')
        it('set value', function() {
          expect(rdata.get('blog.text')).to.equal('This is a test')
        })
      })

      describe('set comments[1].name to "Mary"', function() {
        rdata.set('comments.0.name', 'Mary')
        it('should be "Mary"', function() {
          expect(rdata.get('comments.0.name')).to.equal('Mary')
        })
      })
    })

    describe('default', function() {
      let rdata = resolve(clone(data))
      describe('set default on undefined path"', function() {
        rdata.default('blog.published', true)
        it('set value', function() {
          expect(rdata.get('blog.published')).to.equal(true)
        })
      })

      describe('set default on defined path', function() {
        rdata.default('blog.published', false)
        it('not set value"', function() {
          expect(rdata.get('blog.published')).to.equal(true)
        })
      })
    })

    describe('clear', function() {
      let rdata = resolve(clone(data))
      describe('clears data', function() {
        rdata.clear()
        it('delete all properties owned by object', function() {
          expect(rdata.get('blog')).to.be.undefined
        })
      })
    })
  })
})
