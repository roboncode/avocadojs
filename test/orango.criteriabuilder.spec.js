let expect = require('chai').expect
let criteriaBuilder = require('../lib/helpers/criteriaBuilder')
let jstr = require('tangjs/lib/helpers/jsonStringify')

describe('orango criteria builder', function() {
  describe(`{ foo: 'bar' }`, function() {
    let data = { foo: 'bar' }
    it(jstr(data), function() {
      let c = criteriaBuilder(data)
      expect(c).to.equal('(foo == "bar")')
    })
  })

  describe(`{ foo: 'bar', baz: 'qux' }`, function() {
    let data = { foo: 'bar', baz: 'qux' }
    it(jstr(data), function() {
      let c = criteriaBuilder(data)
      expect(c).to.equal('(foo == "bar" AND baz == "qux")')
    })
  })

  describe(`{ $or: [{ foo: 'bar' }, { baz: 'qux' }] }`, function() {
    let data = { $or: [{ foo: 'bar' }, { baz: 'qux' }] }
    it(jstr(data), function() {
      let c = criteriaBuilder(data)
      expect(c).to.equal('((foo == "bar") OR (baz == "qux"))')
    })
  })

  describe(`{ foo: { $ne: 'bar' } }`, function() {
    let data = { foo: { $ne: 'bar' } }
    it(jstr(data), function() {
      let c = criteriaBuilder(data)
      expect(c).to.equal('(foo != "bar")')
    })
  })

  describe(`{ foo: { $eq: 'bar' } }`, function() {
    let data = { foo: { $eq: 'bar' } }
    it(jstr(data), function() {
      let c = criteriaBuilder(data)
      expect(c).to.equal('(foo == "bar")')
    })
  })

  describe(`{ foo: { $gt: 'bar' } }`, function() {
    let data = { foo: { $gt: 'bar' } }
    it(jstr(data), function() {
      let c = criteriaBuilder(data)
      expect(c).to.equal('(foo > "bar")')
    })
  })

  describe(`{ foo: { $lt: 'bar' } }`, function() {
    let data = { foo: { $lt: 'bar' } }
    it(jstr(data), function() {
      let c = criteriaBuilder(data)
      expect(c).to.equal('(foo < "bar")')
    })
  })

  describe(`{ foo: { $gte: 'bar' } }`, function() {
    let data = { foo: { $gte: 'bar' } }
    it(jstr(data), function() {
      let c = criteriaBuilder(data)
      expect(c).to.equal('(foo >= "bar")')
    })
  })

  describe(`{ foo: { $lte: 'bar' } }`, function() {
    let data = { foo: { $lte: 'bar' } }
    it(jstr(data), function() {
      let c = criteriaBuilder(data)
      expect(c).to.equal('(foo <= "bar")')
    })
  })

  describe(`{ foo: 1 }`, function() {
    let data = { foo: 1 }
    it(jstr(data), function() {
      let c = criteriaBuilder(data)
      expect(c).to.equal('(foo == 1)')
    })
  })

  describe(`{ foo: true }`, function() {
    let data = { foo: true }
    it(jstr(data), function() {
      let c = criteriaBuilder(data)
      expect(c).to.equal('(foo == true)')
    })
  })

  describe(`{ foo: 'bar' }`, function() {
    let data = { foo: 'bar' }
    it(jstr(data), function() {
      let c = criteriaBuilder(data, 'test')
      expect(c).to.equal('(test.`foo` == "bar")')
    })
  })

  describe('{ foo: {bar: null}}', function() {
    let data = { foo: {bar: null}}
    it(jstr(data), function() {
      let c = criteriaBuilder(data, 'test')
      expect(c).to.equal('(test.foo.`bar` == null)')
    })
  })

  describe(`complex criteria`, function() {
    let data = {
      _key: '12345',
      role: 'admin',
      a: {
        // a != 1
        $ne: 1
      },
      b: {
        // b == 2
        $eq: true
      },
      c: {
        // c > 3
        $gt: '3'
      },
      d: {
        // d < 4
        $lt: 'four'
      },
      e: {
        // e >= 5
        $gte: 5
      },
      f: {
        // f <= 6
        $lte: 6
      },
      $or: [
        {
          x1: 1,
          x2: 2
        },
        {
          y: {
            $gt: 3
          }
        },
        {
          $or: [
            {
              z: {
                $lt: 'four'
              }
            },
            {
              z: 10
            }
          ]
        }
      ]
    }
    it(jstr(data), function() {
      let c = criteriaBuilder(data, 'test')
      expect(c).to.equal(
        '(test.`_key` == "12345" AND test.`role` == "admin" AND test.`a` != 1 AND test.`b` == true AND test.`c` > "3" AND test.`d` < "four" AND test.`e` >= 5 AND test.`f` <= 6) AND ((test.`x1` == 1 AND test.`x2` == 2) OR (test.`y` > 3) OR ((test.`z` < "four") OR (test.`z` == 10)))'
      )
    })
  })
})
