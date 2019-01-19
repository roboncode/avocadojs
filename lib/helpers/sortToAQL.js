// https://repl.it/@flashext/AQL-Sort
function sortToAQL(sort, document) {
  let aql = [], i, prop, dir
  if (typeof sort === 'string') {
    sort = sort.replace(/([-])?(\w+)\s+/gi, '$1$2 ').split(' ')
    for (i = 0; i < sort.length; i++) {
      prop = sort[i]
      if (prop) {
        if (prop[0] === '-') {
          aql.push(document + '.' + prop.substr(1), 'DESC')
        } else {
          aql.push(document + '.' + prop)
        }
      }
    }
  } else {
    for (prop in sort) {
      dir = sort[prop] > 0 ? '' : 'DESC'
      aql.push(document + '.' + prop, dir)
    }
  }
  return aql
}

module.exports = sortToAQL