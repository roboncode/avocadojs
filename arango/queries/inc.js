const resolve = require('../../avocado/helpers/resolve')

let tpl = `LET doc = DOCUMENT('@collection/@id') UPDATE doc WITH @queries IN @collection`

async function inc(collection, id, prop, val = 1) {
  const { connection } = require('../index')

  let queries = resolve({})
  let props = [].concat(prop)
  for (let i = 0; i < props.length; i++) {
    prop = props[i]
    queries.set(prop, ('doc.@prop + ' + val).split('@prop').join(prop))
  }
  queries = JSON.stringify(queries.rawData).replace(/"/gi, '')

  let aql = tpl
    .split('@collection')
    .join(collection)
    .split('@id')
    .join(id)
    .split('@queries')
    .join(queries)

    return await connection.db.query(aql)
}

// Example
// let query = inc('users', 'rob', [
//   'stats.friends',
//   'stats.likes',
//   'stats.followers',
// ])

// RESULT:
// LET doc = DOCUMENT('users/rob') UPDATE doc WITH {stats:{friends:doc.stats.friends + 1,followers:doc.stats.followers + 1}} IN users

module.exports = inc
