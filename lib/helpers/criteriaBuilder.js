// Working example
// https://repl.it/@flashext/AQL-Query-Builder

// const {jsonStringify} = require('tangjs/lib/helpers')

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

function criteriaBuilder(criteria, documentName = '', group = true) {
  let aql = []
  let aqlOr = []
  let returnOrStr = ''
  let str = ''

  // if(criteria instanceof Array) {
  //   return jsonStringify(criteria)
  // }

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
            if (val === null) {
              aql.push(prop + ' ' + op + ' ' + val)
            } else {
              let criteriaResult = criteriaBuilder(val, null, false)
              if (criteriaResult[0] !== ' ') {
                aql.push(prop + '.' + criteriaResult)
              } else {
                aql.push(prop + criteriaResult)
              }
            }
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

  if (documentName) {
    // str = str.replace(/(\w+)(\s[!=<>])/g, doc + ".`$1`$2")
    // console.log('before'.bgRed, str)
    // a.b => doc.a.b
    str = str.replace(/([$\w.]+)(\.?)(\s[!=<>])/gi, documentName + ".$1$3")
    // doc.a.b. => doc.a.b
    // str = str.replace(/\.(\s)/gi, "$1")
    // doc.a.b => doc.a.`b`
    str = str.replace(/(\.)(\w+)(\s)/gi, "$1`$2`$3")
  }

  // replace instances of "id" with "_key"
  str.replace(/`(id)`/g, "_key")
  return str
}

module.exports = criteriaBuilder