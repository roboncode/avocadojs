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
const OPERATIONS = {
  COUNT: 'count',
  FIND: 'find',
  INSERT: 'insert',
  REMOVE: 'remove',
  REPLACE: 'replace',
  UPSERT: 'upsert',
  UPDATE: 'update'
}

let count = 1
let query = JSON.parse(fs.readFileSync(__dirname + '/query.json', { encoding: 'utf-8' }))

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
  const doc = query.name || pluralize.singular(col) // the doc id

  let result // this is the defatul result; ex. RETURN user
  let aql

  if (query.method === OPERATIONS.INSERT) {
    aql = AQB.insert(AQB(query.data)).in(col)
  } else {
    aql = AQB.for(doc).in(col) // create FOR..IN

    if (query.name === col) {
      throw new Error('The property "id" cannot be the same name as collection: ' + col)
    }

    if (query.one) {
      query.limit = 1
    }

    if (query.filter) {
      let filterAQL = filterToAQL(query.filter, {
        doc,
        parentDoc: query.$doc
      })
      aql = aql.filter(AQB.expr(filterAQL))
      if (query.offset && query.limit) {
        aql = aql.limit(query.offset, query.limit)
      } else if (query.offset) {
        aql = aql.limit(query.offset, 10)
      } else if (query.limit) {
        aql = aql.limit(query.limit)
      }
    }
  }

  if (query.queries) {
    for (let subquery of query.queries) {
      let id = subquery.id || '_' + count++
      let subq = subquery.query
      subq.$doc = doc
      let q = await parseQuery(subq)
      if (subq.one) {
        aql = aql.let(id, AQB.FIRST(q.aql))
      } else {
        aql = aql.let(id, q.aql)
      }
    }
  }

  if (query.method === OPERATIONS.UPDATE) {
    let data = AQB(await validate(ModelCls, query.data))
    aql = aql.update(doc).with(data).in(col)
  } else if (query.method === OPERATIONS.REMOVE) {
    aql = aql.remove(doc).in(col)
  } else if (query.method === OPERATIONS.UPSERT) {
    let insertData = await validate(ModelCls, query.data.insert)
    let updateData = await validate(ModelCls, query.data.update)
    aql = aql.upsert(doc).insert(insertData).update(updateData).in(col)
  } else if (query.method === OPERATIONS.COUNT) {
    aql = aql.collectWithCountInto('length')
  }

  if (query.return) {
    if (query.return.value) {
      result = query.return.value
      if (typeof result === 'object') {
        let strResult = JSON.stringify(result).replace(/:"(new|old)"/gi, ':`$1`')
        result = AQB.expr(strResult)
      }
    } else if (query.method === OPERATIONS.UPDATE || query.method === OPERATIONS.INSERT) {
      result = 'NEW'
    } else if (query.method === OPERATIONS.REMOVE) {
      result = 'OLD'
    } else {
      result = doc
    }

    if (query.select) {
      let select = query.select.split(' ')
      for (let i = 0; i < select.length; i++) {
        select[i] = AQB.str(select[i])
      }
      result = AQB.KEEP(result, select)
    }

    let actions = query.return.actions
    let merges = []
    for (let i = 0; i < actions.length; i++) {
      let action = actions[i]
      if (action.action === 'append') {
        let data = { [action.as || action.target]: `@{${action.target}}` }
        merges.push(data)
      } else if (action.action === 'merge') {
        merges.push(`@{${action.target}}`)
      }
    }

    if (merges.length) {
      let mergesStr = JSON.stringify(merges)
      mergesStr = mergesStr.replace(/\[(.*)\]/gi, '$1')
      result = AQB.MERGE(result, AQB.expr(mergesStr.replace(/['"]@{([\w|^(.|\n)]+)}['"]/gi, '$1')))
    }

    try {
      aql = aql.return(result)
    } catch (e) {
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
