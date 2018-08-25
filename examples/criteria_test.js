const cb = require('../lib/helpers/criteriaBuilder')

const criteria = {
  _key: 'rob',
  role: 'admin',
  a: { // a != 1
    $ne: 1
  },
  b: { // b == 2
    $eq: true
  },
  c: { // c > 3
    $gt: '3'
  },
  d: { // d < 4
    $lt: 'four'
  },
  e: { // e >= 5
    $gte: 5
  },
  f: { // f <= 6
    $lte: 6
  },
  $or: [{
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
const aql = cb(criteria, 'users')
console.log(aql)