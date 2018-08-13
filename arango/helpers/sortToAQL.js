// https://repl.it/@flashext/AQL-Sort
function sortToAQL(sort, document) {
  let aql = []
  if (typeof sort === 'string') {
    sort = sort.split(',').join(' ').split('  ').join(' ').split(' ')
    for (let i = 0; i < sort.length; i++) {
      let prop = sort[i].trim()
      if (prop) {
        if (prop[0] === '-') {
          aql.push(document + '.' + prop.substr(1) + ' DESC')
        } else {
          aql.push(document + '.' + prop)
        }
      }
    }
  } else {
    for (let prop in sort) {
      let dir = sort[prop] > 0 ? '' : ' DESC'
      aql.push(document + '.' + prop + dir)
    }
  }
  return aql.join(', ')
}


module.exports = sortToAQL