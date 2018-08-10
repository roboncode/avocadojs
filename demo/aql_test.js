const qb = require('aqb')
let results
// results = qb.for('x').in('1..5').return('x').toAQL()
// results = qb.for('doc').in('users').return('doc.firstName').toAQL()
// results = qb.upsert('x').insert('y').replace('z').in('c').toAQL()
// results = qb.filter(
//   qb.eq('firstName', 'Rob'),
// ).filter(
//   qb.eq('lastName', 'Taylor'),
// ).toAQL()

class Builder {
  constructor() {
    this.filters = []
    this.count = 0
  }

  filter(conds) {
    this.filters = this.filters.concat(conds)
    return this
  }

  filtersToAQL() {
    let str = ''
    let filters = this.filters
    if (filters.length) {
      str = 'FILTER '
      for (let i = 0; i < this.filters.length; i++) {
        let filter = this.filters[i]
        for (let key in filter) {
          let value = filter[key]
          if (value.match(/^[^\w+]/)) {
            str += `${key} ${value}`
          } else {
            str += `${key} == ${value}`
          }
        }
      }
    }

    return str
  }

  find(collection) {
    let doc = 'doc_' + (this.count++)
    // this.filtersToAQL(doc)
    let query = qb.for(doc)
    query = query.in(collection)
    query = query.return(doc)
    return query.toAQL()
  }
}

let builder = new Builder('users')
results = builder
  .filter({"firstName": "Rob"})
  .filter({'lastName': "!= 'Taylor'"})
  .filter('lastName != Taylor')
  .find('users')

console.log(results)