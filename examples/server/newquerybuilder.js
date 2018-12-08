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
const METHODS = {
  FIND_ONE: 'findOne',
  UPDATE_ONE: 'updateOne',
  DELETE_ONE: 'deleteOne'
}

let query = JSON.parse(fs.readFileSync(__dirname + '/query.json', { encoding: 'utf-8' }))

function isOne(method) {
  switch (method) {
    case METHODS.FIND_ONE:
    case METHODS.UPDATE_ONE:
    case METHODS.DELETE_ONE:
      return true
  }
  return false
}

async function execQuery(query) {
  let q = await validate(orango.Query, query)
  let result = await parseQuery(q)
  console.log(formatAQL(result.aql.toAQL()).green)
}

async function validate(Model, data) {
  let result = await Builder.getInstance()
    .data(data)
    .convertTo(Model)
    .toObject({
      scope: true // invokes required
    })
    .build()
  return result
}

async function parseQuery(query) {
  const ModelCls = orango.model(query.model)
  const col = ModelCls.collectionName
  const name = query.id || pluralize.singular(col) // the prop name
  const merges = []
  const appends = []

  let result = name // this is the defatul result; ex. RETURN user
  let aql = AQB.for(name).in(col) // create FOR..IN

  if (query.id === col) {
    throw new Error('The property "id" cannot be the same name as collection: ' + col)
  }

  if (isOne(query.method)) {
    query.limit = 1
  }

  if (query.select) {
    let select = query.select.split(' ')
    for (let i = 0; i < select.length; i++) {
      select[i] = AQB.str(select[i])
    }
    result = AQB.KEEP(name, select)
  }

  if (query.filter) {
    let filterAQL = filterToAQL(query.filter, name)
    aql = aql.filter(AQB.expr(filterAQL))
    if (query.offset && query.limit) {
      aql = aql.limit(query.offset, query.limit)
    } else if (query.offset) {
      aql = aql.limit(query.offset, 10)
    } else if (query.limit) {
      aql = aql.limit(query.limit)
    }
  }

  if (query.methods) {
    for (let item of query.methods) {
      let ItemModelCls = orango.model(item.model)
      let id = item.id || ItemModelCls.collectionName
      let result = await parseQuery(item)
      if (isOne(item.method)) {
        aql = aql.let(id, AQB.FIRST(result.aql))
      } else {
        aql = aql.let(id, result.aql)
      }

      if (item.merge) {
        merges.push(id)
      } else if (item.appendAs) {
        appends.push({
          key: item.appendAs || id,
          value: id
        })
      }
    }
  }

  if (query.method === METHODS.DELETE_ONE) {
    aql = aql.remove(name).in(col)
  } else if (query.method === METHODS.UPDATE_ONE) {
    let data = await validate(ModelCls, query.data)
    aql = aql.update(name).with(data).in(col)
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

  if (query.return) {
    try {
      aql = aql.return(query.return.value, name)
    } catch(e) {
      throw e
    }
  }

  return { aql }
}

async function main() {
  readFiles(__dirname + '/models')
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
