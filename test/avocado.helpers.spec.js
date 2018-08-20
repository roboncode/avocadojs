const expect = require('chai').expect
const asyncForEach = require('../tang/helpers/asyncForEach')
const clone = require('../tang/helpers/clone')
const definePrivateProperty = require('../tang/helpers/definePrivateProperty')
const difference = require('../tang/helpers/difference')
// const getObjectKeys = require('../tang/helpers/getObjectKeys')
const jsonStringify = require('../tang/helpers/jsonStringify')
const resolve = require('../tang/helpers/resolve')

describe('tang helpers', () => {
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

  describe('definePrivateProperty', () => {
    it('should create a property that is not enumerable', () => {
      let o = {
        name: 'Rob'
      }
      definePrivateProperty(o, 'message', 'Hello, world!')
      let keys = Object.keys(o)
      expect(keys).to.contain('name')
      expect(keys).not.to.contain('message')
    })
  })

  describe('difference', () => {
    it('should return the difference between two objects', () => {
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

  // describe('getObjectKeys', () => {
  //   it('should return fullpath object keys', () => {
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

  describe('JSON.stringify vs jsonStringify with circular reference', () => {

    function Foo() {
      this.message = "Hello";
      this.circular = this;
    }

    var foo = new Foo();

    describe('JSON.stringify', () => {
      it('should throw circular reference error', () => {
        let fn = function () {
          return JSON.stringify(foo)
        }
        expect(fn).to.throw('circular')
      })
    })

    describe('jsonStringify', () => {
      it('should convert to string', () => {
        expect(jsonStringify(foo)).to.equal('{"message":"Hello"}')
      })
    })
  })

  describe('resolve', () => {
    let data = {
      blog: {
        id: 1,
        text: "My First Blog"
      },
      comments: [{
          name: "John",
          text: "Hello, world!"
        },
        {
          name: "Jane",
          text: "hi"
        }
      ]
    }

    describe('get', () => {
      let rdata = resolve(clone(data))
      describe('blog.id', () => {
        it('should be 1', () => {
          expect(rdata.get('blog.id')).to.equal(1)
        })
      })

      describe('comments[1].name', () => {
        it('should be "Jane"', () => {
          expect(rdata.get('comments.1.name')).to.equal('Jane')
        })
      })
    })

    describe('set', () => {
      let rdata = resolve(clone(data))
      describe('set blog.id to "This is a test"', () => {
        rdata.set('blog.text', 'This is a test')
        it('set value', () => {
          expect(rdata.get('blog.text')).to.equal('This is a test')
        })
      })

      describe('set comments[1].name to "Mary"', () => {
        rdata.set('comments.0.name', 'Mary')
        it('should be "Mary"', () => {
          expect(rdata.get('comments.0.name')).to.equal('Mary')
        })
      })
    })

    describe('default', () => {
      let rdata = resolve(clone(data))
      describe('set default on undefined path"', () => {
        rdata.default('blog.published', true)
        it('set value', () => {
          expect(rdata.get('blog.published')).to.equal(true)
        })
      })

      describe('set default on defined path', () => {
        rdata.default('blog.published', false)
        it('not set value"', () => {
          expect(rdata.get('blog.published')).to.equal(true)
        })
      })
    })

    describe('clear', () => {
      let rdata = resolve(clone(data))
      describe('clears data', () => {
        rdata.clear()
        it('delete all properties owned by object', () => {
          expect(rdata.get('blog')).to.be.undefined
        })
      })
    })
  })

})