require('app-module-path').addPath(__dirname)
const fs = require('fs')
const orango = require('orango')
const readFiles = require('./helpers/readFiles')
const pluralize = require('pluralize')
const { Builder } = require('tangjs/lib')
const { filterToAQL } = orango.helpers
const formatAQL = require('./prettyaql')
require('colors')

const AQB = orango.AQB

let query = JSON.parse(fs.readFileSync('query.json', { encoding: 'utf-8' }))

function isOne(method) {
  switch (method) {
    case 'findOne':
    case 'updateOne':
    case 'deleteOne':
      return true
  }
  return false
}

async function execQuery(data) {
  let q = await Builder.getInstance()
    .data(data)
    .convertTo(orango.Query)
    .toObject({
      computed: true,
      scope: true // invokes required
    })
    .build()

  let result = parseQuery(q)
  console.log(formatAQL(result.toAQL()).green)
}

function parseQuery(data) {
  let ModelCls = orango.model(data.model)
  let col = ModelCls.collectionName

  if (data.id === col) {
    throw new Error('The property "id" cannot be the same name as collection: ' + col)
  }

  let name = data.id || pluralize.singular(col)
  let aql = AQB.for(name).in(col)
  let result = name

  if (isOne(data.method)) {
    data.limit = 1
  }

  if (data.select) {
    let select = data.select.split(' ')
    for (let i = 0; i < select.length; i++) {
      select[i] = AQB.str(select[i])
    }
    result = AQB.KEEP(name, select)
  }

  if (data.filter) {
    let filterAQL = filterToAQL(data.filter, name)
    aql = aql.filter(AQB.expr(filterAQL))
    if (data.offset && data.limit) {
      aql = aql.limit(data.offset, data.limit)
    } else if (data.offset) {
      aql = aql.limit(data.offset, 10)
    } else if (data.limit) {
      aql = aql.limit(data.limit)
    }
  }

  // dummy
  // these are just properties???
  // let merges = ['junk', 'test']
  let merges = []
  // these are populates
  let appends = []

  if (data.methods) {
    for (let item of data.methods) {
      let ItemModelCls = orango.model(item.model)
      let id = item.id || ItemModelCls.collectionName
      if (isOne(item.method)) {
        aql = aql.let(id, AQB.FIRST(parseQuery(item)))
      } else {
        aql = aql.let(id, parseQuery(item))
      }

      if (item.merge) {
        merges.push(id)
      } else {
        appends.push({
          key: item.appendAs || id,
          value: id
        })
      }
    }
  }

  if (data.method === 'deleteOne') {
    aql = aql.remove(name).in(col)
  }

  let appendData = {}
  for (let i = 0; i < appends.length; i++) {
    appendData[appends[i].key] = appends[i].value
  }

  if (appends.length && merges.length) {
    result = AQB.MERGE(result, AQB.expr(merges.join(', ')), appendData)
  } else if (merges.length) {
    result = AQB.MERGE(result, AQB.expr(merges.join(', ')))
  } else if (appends.length) {
    result = AQB.MERGE(result, appendData)
  }

  try {
    aql = aql.return(result)
  } catch (e) {}
  return aql
}

async function main() {
  readFiles('models')
  await execQuery(query)
}

// TODO: This will be used to modify results
// let modifier = {
//   single: true,
//   model: 'Identity',
//   return: {
//     id: true,
//     computed: true
//   },
//   children: [
//     {
//       prop: 'user',
//       single: true,
//       model: 'User',
//       return: {
//         id: true,
//         computed: true
//       }
//     }
//   ]
// }

main()
