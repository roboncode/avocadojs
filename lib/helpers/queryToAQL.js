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
    if (query.toJSON) {
      query = query.toJSON()
    }
    let q = await this.validate(null, Query, query)
    let result = await this.parseQuery(q)
    let aql = result.aql.toAQL()
    if (formatted) {
      aql = formatAQL(aql)
    }
    return aql
  }

  async validate(operation, Model, data, options = {}) {
    let result = await Builder.getInstance()
      .data(data)
      .convertTo(Model)
      .intercept(model => {
        const ModelCls = model.constructor
        if (ModelCls.hooks && ModelCls.hooks[operation]) {
          return ModelCls.hooks[operation](model)
        }
      })
      .toObject(options)
      .build()
    return result
  }

  getOptions(Model, query) {
    return {
      noDefaults: query.withDefaults !== true,
      scope: true,
      unknownProps: Model.schema._options.strict === false ? 'allow' : 'strip'
    }
  }

  parseForIn(aql, query, { doc, col }) {
    aql = AQB.for(doc).in(col) // create FOR..IN

    if (query.name === col) {
      throw new Error(
        'The property "id" cannot be the same name as collection: ' + col
      )
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
        let id = subquery.let || '_' + count++
        let subq = subquery
        subq.query.$doc = doc
        let q = await this.parseQuery(subq.query)
        if (subq.return && subq.return.one) {
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
      let data = AQB(await this.validate(OPERATIONS.UPDATE, ModelCls, query.data))
      aql = aql
        .update(doc)
        .with(data)
        .in(col)
    } else if (query.method === OPERATIONS.UPSERT) {
      const ModelCls = this.orango.model(query.model)
      const options = this.getOptions(ModelCls, query)
      query.data.insert = await this.validate(OPERATIONS.INSERT, ModelCls, query.data.insert, options)
      query.data.update = await this.validate(OPERATIONS.UPDATE, ModelCls, query.data.update)
    } else if (query.method === OPERATIONS.REPLACE) {
      const ModelCls = this.orango.model(query.model)
      let data = AQB(await this.validate(OPERATIONS.UPDATE, ModelCls, query.data))
      aql = aql
        .replace(doc)
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
        query.method === OPERATIONS.UPSERT ||
        query.method === OPERATIONS.REPLACE
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

      let actions = query.return.actions || []
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

  async parseInsert(query) {
    const ModelCls = this.orango.model(query.model)
    const options = this.getOptions(ModelCls, query)
    query.data = await this.validate(OPERATIONS.INSERT, ModelCls, query.data, options)
  }

  async parseUpsert(query) {
    const ModelCls = this.orango.model(query.model)
    const options = this.getOptions(ModelCls, query)
    query.data.insert = await this.validate(
      OPERATIONS.INSERT,
      ModelCls,
      query.data.insert,
      options
    )
    query.data.update = await this.validate(OPERATIONS.UPDATE, ModelCls, query.data.update)
  }

  async parseImport(query) {
    const ModelCls = this.orango.model(query.model)
    const options = this.getOptions(ModelCls, query)
    query.data.data = await this.validate(OPERATIONS.INSERT, ModelCls, query.data.data, options)
  }

  async parseLink(query) {
    if (query.data.from) {
      query.data._from = query.data.from
    }
    if (query.data.to) {
      query.data._to = query.data.to
    }
    delete query.data.from
    delete query.data.to

    const ModelCls = this.orango.model(query.model)
    const options = this.getOptions(ModelCls, query)
    query.data = await this.validate(OPERATIONS.INSERT, ModelCls, query.data, options)
  }

  async parseInitialOperations(query, { doc, col }) {
    let aql
    if (query.method === OPERATIONS.INSERT) {
      await this.parseInsert(query)
      aql = AQB.insert(AQB(query.data)).in(col)
    } else if (query.method === OPERATIONS.UPSERT) {
      await this.parseUpsert(query)
      aql = AQB.upsert(AQB(query.where))
        .insert(AQB(query.data.insert))
        .update(AQB(query.data.update))
        .in(col)
    // } else if (query.method === OPERATIONS.REPLACE) {
    //   aql = this.parseForIn(aql, query, { doc, col })
    } else if (query.method === OPERATIONS.LINK) {
      await this.parseLink(query)
      aql = AQB.insert(AQB(query.data)).in(col)
    } else if (query.method === OPERATIONS.UNLINK) {
      await this.parseLink(query)
      aql = AQB.remove(AQB(query.data)).in(col)
    } else if (query.method === OPERATIONS.IMPORT) {
      await this.parseImport(query)
      aql = this.parseForIn(aql, query, { doc, col: AQB(query.data.data) })
        .insert(doc)
        .in(col)
    } else {
      aql = this.parseForIn(aql, query, { doc, col })
    }
    return aql
  }

  async parseQuery(query) {
    const ModelCls = this.orango.model(query.model)
    const col = ModelCls.collectionName
    const doc = query.name || pluralize.singular(col) // the doc id

    let aql = await this.parseInitialOperations(query, { doc, col })
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
