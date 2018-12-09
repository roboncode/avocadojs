// Working example
// https://repl.it/@flashext/AQL-Query-Builder

// const {jsonStringify} = require('tangjs/lib/helpers')

const operators = {
  $eq: '==',
  $gt: '>',
  $gte: '>=',
  $lt: '<',
  $lte: '<=',
  $ne: '!='
}

const logicalOperators = {
  AND: ' AND ',
  OR: ' OR '
}

function filterToAQL(filter, options = {}) {
  let aql = []
  let aqlOr = []
  let returnOrStr = ''
  let str = ''

  // if(filter instanceof Array) {
  //   return jsonStringify(filter)
  // }

  for (let prop in filter) {
    if (filter.hasOwnProperty(prop)) {
      let val = filter[prop]
      let op = operators.$eq
      let isOperator = operators[prop]

      if (isOperator) {
        op = operators[prop]
        prop = ''
      }
      if (prop === '$or') {
        for (let i = 0; i < val.length; i++) {
          aqlOr.push(filterToAQL(val[i]))
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
              let filterResult = filterToAQL(val, {
                group: false
              })
              if (filterResult[0] !== ' ') {
                aql.push(prop + '.' + filterResult)
              } else {
                aql.push(prop + filterResult)
              }
            }
            break
        }
      }
    }
  }

  if (options.group) {
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

  if (options.doc) {
    // (source == "@@parent.source") => (source == @@parent.source)
    // str = str.replace(/"(@@[\w.]+)"/gi, "$1")

    // ^._key => doc._key
    str = str.replace(/(\^)\./gi, options.parentDoc + '.')

    // a.b => doc.a.b
    str = str.replace(/([$\w.]+)(\.?)(\s[!<>=])/gi, options.doc + '.$1$3')

    // doc.a.b => doc.a.`b`
    str = str.replace(/(\.)(\w+)(\s)/gi, '$1`$2`$3')
  }

  // convert @{} expressions
  str = str.replace(/['"]@{([\w|^(.|\n)]+)}['"]/gi, '$1')

  // replace instances of "id" with "_key"
  // str.replace(/`(id)`/g, "_key")
  return str
}

module.exports = filterToAQL
