let filterToAQL = require('../lib/helpers/filterToAQL')
let stringify = require('tangjs/lib/helpers/jsonStringify')

describe(`{ foo: 'bar' }`, () => {
  let data = { foo: 'bar' }
  test(stringify(data), () => {
    let c = filterToAQL(data)
    expect(c).toBe('foo == "bar"')
  })
})

describe(`{ foo: 'bar', baz: 'qux' }`, () => {
  let data = { foo: 'bar', baz: 'qux' }
  test(stringify(data), () => {
    let c = filterToAQL(data)
    expect(c).toBe('foo == "bar" AND baz == "qux"')
  })
})

describe(`{ $or: [{ foo: 'bar' }, { baz: 'qux' }] }`, () => {
  let data = { $or: [{ foo: 'bar' }, { baz: 'qux' }] }
  test(stringify(data), () => {
    let c = filterToAQL(data)
    expect(c).toBe('(foo == "bar" OR baz == "qux")')
  })
})

describe(`{ foo: { $ne: 'bar' } }`, () => {
  let data = { foo: { $ne: 'bar' } }
  test(stringify(data), () => {
    let c = filterToAQL(data)
    expect(c).toBe('foo != "bar"')
  })
})

describe(`{ foo: { $eq: 'bar' } }`, () => {
  let data = { foo: { $eq: 'bar' } }
  test(stringify(data), () => {
    let c = filterToAQL(data)
    expect(c).toBe('foo == "bar"')
  })
})

describe(`{ foo: { $gt: 'bar' } }`, () => {
  let data = { foo: { $gt: 'bar' } }
  test(stringify(data), () => {
    let c = filterToAQL(data)
    expect(c).toBe('foo > "bar"')
  })
})

describe(`{ foo: { $lt: 'bar' } }`, () => {
  let data = { foo: { $lt: 'bar' } }
  test(stringify(data), () => {
    let c = filterToAQL(data)
    expect(c).toBe('foo < "bar"')
  })
})

describe(`{ foo: { $gte: 'bar' } }`, () => {
  let data = { foo: { $gte: 'bar' } }
  test(stringify(data), () => {
    let c = filterToAQL(data)
    expect(c).toBe('foo >= "bar"')
  })
})

describe(`{ foo: { $lte: 'bar' } }`, () => {
  let data = { foo: { $lte: 'bar' } }
  test(stringify(data), () => {
    let c = filterToAQL(data)
    expect(c).toBe('foo <= "bar"')
  })
})

describe(`{ foo: 1 }`, () => {
  let data = { foo: 1 }
  test(stringify(data), () => {
    let c = filterToAQL(data)
    expect(c).toBe('foo == 1')
  })
})

describe(`{ foo: true }`, () => {
  let data = { foo: true }
  test(stringify(data), () => {
    let c = filterToAQL(data)
    expect(c).toBe('foo == true')
  })
})

describe(`{ foo: 'bar' }`, () => {
  let data = { foo: 'bar' }
  test(stringify(data), () => {
    let c = filterToAQL(data, { doc: 'test' })
    expect(c).toBe('test.`foo` == "bar"')
  })
})

describe('{ foo: {bar: null}}', () => {
  let data = { foo: { bar: null } }
  test(stringify(data), () => {
    let c = filterToAQL(data, { doc: 'test' })
    expect(c).toBe('test.foo.`bar` == null')
  })
})

describe(`complex criteria`, () => {
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
  test(stringify(data), () => {
    let c = filterToAQL(data, { doc: 'test' })
    expect(c).toBe('test.`_key` == "12345" AND test.`role` == "admin" AND test.`a` != 1 AND test.`b` == true AND test.`c` > "3" AND test.`d` < "four" AND test.`e` >= 5 AND test.`f` <= 6 AND (test.`x1` == 1 AND test.`x2` == 2 OR test.`y` > 3 OR (test.`z` < "four" OR test.`z` == 10))')
  })
})
