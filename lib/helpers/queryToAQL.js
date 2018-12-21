const pluralize = require('pluralize')
const { Builder } = require('tangjs/lib')
const { OPERATIONS } = require('../consts')
const AQB = require('./aqb')
const filterToAQL = require('./filterToAQL')
const formatAQL = require('./formatAQL')
const Query = require('../models/Query')
require('colors')

class QueryToAQL {
  constructor(orango) {
    this.orango = orango
    this.count = 1
  }

  async generate(query, formatted = false) {
    let q = await this.validate(Query, query.q)
    let result = await this.parseQuery(q)
    let aql = result.aql.toAQL()
    if (formatted) {
      aql = formatAQL(aql)
    }
    return aql
  }

  async validate(Model, data) {
    let result = await Builder.getInstance()
      .data(data)
      .convertTo(Model)
      .toObject({
        scope: true // invokes required
      })
      .build()
    return result
  }

  parseImport(query) {}

  parseForIn(aql, query, { doc, col }) {
    aql = AQB.for(doc).in(col) // create FOR..IN

    if (query.name === col) {
      throw new Error(
        'The property "id" cannot be the same name as collection: ' + col
      )
    }

    if (query.one) {
      query.limit = 1
    }

    if (query.where) {
      let filterAQL = filterToAQL(query.where, {
        doc,
        parentDoc: query.$doc
      })
      aql = aql.filter(AQB.expr(filterAQL))
    }

    if (query.offset && query.limit) {
      aql = aql.limit(query.offset, query.limit)
    } else if (query.offset) {
      aql = aql.limit(query.offset, 10)
    } else if (query.limit) {
      aql = aql.limit(query.limit)
    }
    return aql
  }

  parseLets(aql, query, { doc, col }) {
    if (query.lets) {
      for (let key in query.lets) {
        aql = aql.let(key, AQB(query.lets[key]))
      }
    }
    return aql
  }

  async parseQueries(aql, query, { doc, col }) {
    if (query.queries) {
      for (let subquery of query.queries) {
        let id = subquery.id || '_' + count++
        let subq = subquery.query
        subq.q.$doc = doc
        let q = await this.parseQuery(subq.q)
        if (subq.one) {
          aql = aql.let(id, AQB.FIRST(q.aql))
        } else {
          aql = aql.let(id, q.aql)
        }
      }
    }
    return aql
  }

  async parseOperations(aql, query, { doc, col }) {
    if (query.method === OPERATIONS.UPDATE) {
      const ModelCls = this.orango.model(query.model)
      let data = AQB(await this.validate(ModelCls, query.data))
      aql = aql
        .update(doc)
        .with(data)
        .in(col)
    } else if (query.method === OPERATIONS.REMOVE) {
      aql = aql.remove(doc).in(col)
    } else if (query.method === OPERATIONS.COUNT) {
      aql = aql.collectWithCountInto('length')
    }
    return aql
  }

  parseReturn(aql, query, { doc, col }) {
    let result // this is the defatul result; ex. RETURN user
    if (query.return) {
      if (query.return.value) {
        result = query.return.value
        if (typeof result === 'object') {
          let strResult = JSON.stringify(result).replace(
            /:"(new|old)"/gi,
            ':`$1`'
          )
          result = AQB.expr(strResult)
        }
      } else if (
        query.method === OPERATIONS.UPDATE ||
        query.method === OPERATIONS.INSERT ||
        query.method === OPERATIONS.UPSERT
      ) {
        result = 'NEW'
      } else if (query.method === OPERATIONS.REMOVE) {
        result = 'OLD'
      } else if (query.method === OPERATIONS.COUNT) {
        result = 'length'
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
          let data = {
            [action.as || action.target]: `@{${action.target}}`
          }
          merges.push(data)
        } else if (action.action === 'merge') {
          merges.push(`@{${action.target}}`)
        }
      }

      if (merges.length) {
        let mergesStr = JSON.stringify(merges)
        mergesStr = mergesStr.replace(/\[(.*)\]/gi, '$1')
        result = AQB.MERGE(
          result,
          AQB.expr(mergesStr.replace(/['"]@{([\w|^(.|\n)]+)}['"]/gi, '$1'))
        )
      }

      try {
        aql = aql.return(result)
      } catch (e) {
        throw e
      }
    }
    return aql
  }

  parseLink(query) {
    if (query.data.from) {
      query.data._from = query.data.from
    }
    if (query.data.to) {
      query.data._to = query.data.to
    }
    delete query.data.from
    delete query.data.to
  }

  async parseQuery(query) {
    const ModelCls = this.orango.model(query.model)
    const col = ModelCls.collectionName
    const doc = query.name || pluralize.singular(col) // the doc id

    let aql

    // if (query.method === OPERATIONS.IMPORT) {
    //   this.parseImport(query)
    //   // Nothing can be returned
    //   return {
    //     aql: AQB()
    //   }
    // }

    if (query.method === OPERATIONS.INSERT) {
      aql = AQB.insert(AQB(query.data)).in(col)
    } else if (query.method === OPERATIONS.UPSERT) {
      aql = AQB.upsert(AQB(query.where))
        .insert(AQB(query.data.insert))
        .update(AQB(query.data.update))
        .in(col)
    } else if (query.method === OPERATIONS.LINK) {
      this.parseLink(query)
      aql = AQB.insert(AQB(query.data)).in(col)
    } else if (query.method === OPERATIONS.UNLINK) {
      this.parseLink(query)
      aql = AQB.remove(AQB(query.data)).in(col)
    } else if (query.method === OPERATIONS.IMPORT) {
      aql = this.parseForIn(aql, query, { doc, col: AQB(query.data.data) })
        .insert(doc)
        .in(col)
    } else {
      aql = this.parseForIn(aql, query, { doc, col })
    }

    aql = this.parseLets(aql, query, { doc, col })
    aql = await this.parseQueries(aql, query, { doc, col })
    aql = await this.parseOperations(aql, query, { doc, col })
    aql = this.parseReturn(aql, query, { doc, col })

    return { aql }
  }
}

module.exports = function(orango) {
  return new QueryToAQL(orango)
}
