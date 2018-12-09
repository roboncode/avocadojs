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
  FIND: 'find',
  FIND_ONE: 'findOne',
  UPDATE: 'update',
  UPDATE_ONE: 'updateOne',
  DELETE: 'delete',
  DELETE_ONE: 'deleteOne'
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
  const doc = query.alias || pluralize.singular(col) // the doc id
  const merges = []
  const appends = []

  let result // this is the defatul result; ex. RETURN user
  let aql = AQB.for(doc).in(col) // create FOR..IN

  if (query.return) {
    if (query.return.as) {
      result = query.return.as
      if (typeof result === 'object') {
        let strResult = JSON.stringify(result).replace(/:"(new|old)"/gi, ':`$1`')
        result = AQB.expr(strResult)
      }
    } else if (query.method === METHODS.UPDATE) {
      result = 'NEW'
    } else {
      result = doc
    }
  }

  if (query.alias === col) {
    throw new Error('The property "id" cannot be the same name as collection: ' + col)
  }

  if (query.one) {
    query.limit = 1
  }

  if (query.select) {
    let select = query.select.split(' ')
    for (let i = 0; i < select.length; i++) {
      select[i] = AQB.str(select[i])
    }
    result = AQB.KEEP(result, select)
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

  if (query.methods) {
    for (let item of query.methods) {
      // let ItemModelCls = orango.model(item.model)
      let id = item.appendAs || '_' + count++
      item.$doc = doc
      let result = await parseQuery(item)
      if (item.one) {
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
    aql = aql.remove(doc).in(col)
  } else if (query.method === METHODS.UPDATE_ONE) {
    let data = await validate(ModelCls, query.data)
    aql = aql.update(doc).with(data).in(col)
  } else if (query.method === METHODS.UPDATE) {
    let data = await validate(ModelCls, query.data)
    aql = aql.update(doc).with(data).in(col)
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
      // let returnVal = query.return.as
      // if(!returnVal && query.method === METHODS.UPDATE) {
      //   returnVal = 'NEW'
      // } else {
      //   returnVal = doc
      // }
      // aql = aql.return(returnVal)
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
