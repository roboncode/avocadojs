// Working example
// https://repl.it/@flashext/AQL-Query-Builder

const operators = {
  '$eq': '==',
  '$gt': '>',
  '$gte': '>=',
  '$lt': '<',
  '$lte': '<=',
  '$ne': '!='
}

const logicalOperators = {
  AND: ' AND ',
  OR: ' OR '
}

function criteriaBuilder(criteria) {
  const doc = arguments[1]
  const group = arguments[2] !== undefined ? arguments[2] : true

  let aql = []
  let aqlOr = []
  let returnOrStr = ''
  let str = ''

  for (let prop in criteria) {

    if (criteria.hasOwnProperty(prop)) {
      let val = criteria[prop]
      let op = operators.$eq
      let isOperator = operators[prop]

      if (isOperator) {
        op = operators[prop]
        prop = ''
      }
      if (prop === '$or') {
        for (let i = 0; i < val.length; i++) {
          aqlOr.push(criteriaBuilder(val[i]))
        }
        returnOrStr = '(' + aqlOr.join(logicalOperators.OR) + ')'
      } else {
        switch (typeof val) {
          case 'number':
          case 'boolean':
            aql.push(prop + ' ' + op + ' ' + val)
            break
          case 'string':
            aql.push(prop + ' ' + op + ' "' + val + '"')
            break
          case 'object':
            aql.push(prop + criteriaBuilder(val, null, false))
            break
        }
      }
    }
  }

  if (group) {
    if (aql.length) {
      str = '(' + aql.join(logicalOperators.AND) + ')'
    }
  } else {
    str = aql.join(logicalOperators.AND)
  }

  if (returnOrStr.length) {
    if (str) {
      str += logicalOperators.AND
    }
    str += returnOrStr
  }

  if (doc) {
    str = str.replace(/(\w+)(\s[!=<>])/g, doc + ".`$1`$2")
  }

  return str
}

module.exports = criteriaBuilder
