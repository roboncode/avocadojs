const pluralize = require('pluralize')
const { builder } = require('tangjs/lib')
const { OPERATIONS } = require('../consts')
const AQB = require('./aqb')
const filterToAQL = require('./filterToAQL')
const formatAQL = require('./formatAQL')
const aqlFuncs = require('../helpers/aqlFuncs')
const sortToAQL = require('../helpers/sortToAQL')
require('colors')

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
class QueryToAQL {
  constructor(orango) {
    this.orango = orango
    this.count = 1
  }

  async generate(query, formatted = false) {
    if (query.toJSON) {
      query = query.toJSON()
    }
    let q = query
    // only validate query structure if coming from an external sourcelike a web browser
    if(!query.__internal) { 
      this.QueryModel = this.orango.model('Query')
      q = await this.validate(null, this.QueryModel, query)
    }
    let result = await this.parseQuery(q)
    let aql = result.aql.toAQL()
    // "@{expression}" => expession
    aql = aql.replace(/['"]@{(.+?)}['"]/gi, '$1')

    if (formatted) {
      aql = formatAQL(aql)
    }
    return aql
  }

  async validate(operation, Model, data, options = {}) {
    let b = await builder()
      .data(data)
      .convertTo(Model)
    if (operation === OPERATIONS.INSERT || operation === OPERATIONS.UPDATE) {
      b.intercept(async model => {
        let d = {}
        if (operation === OPERATIONS.INSERT) {
          d = Model.schema.insertDefaults
        } else if (operation === OPERATIONS.UPDATE) {
          d = Model.schema.updateDefaults
        }
        for (let n in d) {
          if (typeof d[n] === 'function') {
            model[n] = d[n](model)
          } else if(model[n] === undefined) { 
            // this is where array was getting overwritten
            model[n] = d[n]
          }
        }
        model.emit(operation, model)
      })
    }
    return b.toObject(options).build()
  }

  getOptions(Model, query, scope) {
    return {
      noDefaults: query.withDefaults !== true,
      scope,
      unknownProps: Model.schema.options.strict === false ? 'allow' : 'strip'
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

    if (query.sort) {
      let sort = sortToAQL(query.sort, doc)
      aql = aql.sort.apply(aql, sort)
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

  parseForInVertex(aql, query, { doc, col }) {
    if (query.name === col) {
      throw new Error(
        'The property "id" cannot be the same name as collection: ' + col
      )
    }

    let modelName = capitalize(query.vertex.target)
    const ModelCls = this.orango.model(modelName)
    aql = AQB.for(doc).in(
      AQB.expr(
        `${query.vertex.direction} '${ModelCls.collectionName}/${
          query.outbound.id
        }' ${col}`
      )
    )

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

    if (query.sort) {
      let sort = sortToAQL(query.sort, doc)
      aql = aql.sort.apply(aql, sort)
    }

    return aql
  }

  parseLets(aql, query) {
    if (query.lets) {
      for (let key in query.lets) {
        aql = aql.let(key, AQB(query.lets[key]))
      }
    }
    return aql
  }

  async parseQueries(aql, query, { doc }) {
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

  formatIncDecValues(doc, queryData) {
    let queryStr = JSON.stringify(queryData)
    return queryStr.replace(
      /"(\w+)":"([+-]){2}(\d+)"/gi,
      `"$1": ${doc}.$1 $2 $3`
    )
  }

  async parseOperations(aql, query, { doc, col }) {
    if (query.method === OPERATIONS.UPDATE) {
      const ModelCls = this.orango.model(query.model)
      let data = await this.validate(
        OPERATIONS.UPDATE,
        ModelCls,
        query.data,
        this.getOptions(ModelCls, query, OPERATIONS.UPDATE)
      )
      let dataStr = this.formatIncDecValues(doc, data)
      aql = aql
        .update(doc)
        .with(AQB.expr(dataStr))
        .in(col)
    } else if (query.method === OPERATIONS.UPSERT) {
      const ModelCls = this.orango.model(query.model)
      query.data.insert = await this.validate(
        OPERATIONS.INSERT,
        ModelCls,
        query.data.insert,
        this.getOptions(ModelCls, query, OPERATIONS.INSERT)
      )
      query.data.update = await this.validate(
        OPERATIONS.UPDATE,
        ModelCls,
        query.data.update,
        this.getOptions(ModelCls, query, OPERATIONS.UPDATE)
      )
    } else if (query.method === OPERATIONS.REPLACE) {
      const ModelCls = this.orango.model(query.model)
      let data = AQB(
        await this.validate(
          OPERATIONS.UPDATE,
          ModelCls,
          query.data,
          this.getOptions(ModelCls, query, OPERATIONS.INSERT)
        )
      )
      aql = aql
        .replace(doc)
        .with(data)
        .in(col)
    } else if (query.method === OPERATIONS.UNLINK) {
      aql = aql.remove(doc).in(col)
    } else if (query.method === OPERATIONS.REMOVE) {
      aql = aql.remove(doc).in(col)
    } else if (query.method === OPERATIONS.COUNT) {
      aql = aql.collectWithCountInto('length')
    }
    return aql
  }

  parseReturn(aql, query, { doc }) {
    let result // this is the defatul result; ex. RETURN user
    if (query.return) {
      if (query.return.value) {
        result = query.return.value
        if (typeof result === 'object') {
          let strResult = JSON.stringify(result)
          result = AQB.expr(strResult)
        }
      } else if (
        query.method === OPERATIONS.UPDATE ||
        query.method === OPERATIONS.INSERT ||
        query.method === OPERATIONS.UPSERT ||
        query.method === OPERATIONS.IMPORT ||
        query.method === OPERATIONS.REPLACE ||
        query.method === OPERATIONS.LINK
      ) {
        result = 'NEW'
      } else if (
        query.method === OPERATIONS.REMOVE ||
        query.method === OPERATIONS.UNLINK
      ) {
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
        if (query.return.distinct) {
          aql = aql.returnDistinct(result)
        } else {
          aql = aql.return(result)
        }
      } catch (e) {
        throw e
      }
    }
    return aql
  }

  async parseInsert(query) {
    const ModelCls = this.orango.model(query.model)
    query.data = await this.validate(
      OPERATIONS.INSERT,
      ModelCls,
      query.data,
      this.getOptions(ModelCls, query, OPERATIONS.INSERT)
    )
  }

  async parseUpsert(query) {
    const ModelCls = this.orango.model(query.model)
    query.data.insert = await this.validate(
      OPERATIONS.INSERT,
      ModelCls,
      query.data.insert,
      this.getOptions(ModelCls, query, OPERATIONS.INSERT)
    )
    query.data.update = await this.validate(
      OPERATIONS.UPDATE,
      ModelCls,
      query.data.update,
      this.getOptions(ModelCls, query, OPERATIONS.UPDATE)
    )
  }

  async parseImport(query) {
    const ModelCls = this.orango.model(query.model)
    query.data.data = await this.validate(
      OPERATIONS.INSERT,
      ModelCls,
      query.data.data,
      this.getOptions(ModelCls, query, OPERATIONS.INSERT)
    )
  }

  async parseLink(query) {
    const ModelCls = this.orango.model(query.model)
    const fromTargets = [].concat(ModelCls.schema.options.from)
    const toTargets = [].concat(ModelCls.schema.options.to)

    for (let name in query.data.targets) {
      let modelName = capitalize(name)

      if (fromTargets.indexOf(modelName) !== -1) {
        let fromModelCls = this.orango.model(modelName)
        query.data._from =
          fromModelCls.collectionName + '/' + query.data.targets[name]
      } else if (toTargets.indexOf(modelName) !== -1) {
        let toModelCls = this.orango.model(modelName)
        query.data._to =
          toModelCls.collectionName + '/' + query.data.targets[name]
      }
    }

    if (!query.data._from) {
      throw new Error('Missing required "_from" for link')
    }

    if (!query.data._to) {
      throw new Error('Missing required "_to" for link')
    }

    // const ModelCls = this.orango.model(query.model)
    query.data = await this.validate(
      OPERATIONS.LINK,
      ModelCls,
      query.data,
      this.getOptions(ModelCls, query, OPERATIONS.INSERT)
    )
  }

  async parseUnlink(query) {
    const ModelCls = this.orango.model(query.model)
    const fromTargets = [].concat(ModelCls.schema.options.from)
    const toTargets = [].concat(ModelCls.schema.options.to)

    query.where = {}

    for (let name in query.data.targets) {
      let modelName = capitalize(name)

      if (fromTargets.indexOf(modelName) !== -1) {
        let fromModelCls = this.orango.model(modelName)
        query.where._from =
          fromModelCls.collectionName + '/' + query.data.targets[name]
      } else if (toTargets.indexOf(modelName) !== -1) {
        let toModelCls = this.orango.model(modelName)
        query.where._to =
          toModelCls.collectionName + '/' + query.data.targets[name]
      }
    }

    if (!(query.where._from && query.where._to)) {
      throw new Error('Missing required "_from" or "_to" for unlink')
    }

    // const ModelCls = this.orango.model(query.model)
    query.data = await this.validate(
      OPERATIONS.UNLINK,
      ModelCls,
      query.data,
      this.getOptions(ModelCls, query) // TODO: Fix getOptions
    )
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
    } else if (query.method === OPERATIONS.LINK) {
      await this.parseLink(query)
      aql = AQB.insert(AQB(query.data)).in(col)
    } else if (query.method === OPERATIONS.UNLINK) {
      await this.parseUnlink(query)
      aql = this.parseForIn(aql, query, { doc, col })
    } else if (query.method === OPERATIONS.IMPORT) {
      await this.parseImport(query)
      aql = this.parseForIn(aql, query, { doc, col: AQB(query.data.data) })
        .insert(doc)
        .in(col)
    } else if (query.method === OPERATIONS.RETURN) {
      aql = AQB.let(doc, AQB(query.data.expression))
    } else if (query.vertex) {
      aql = this.parseForInVertex(aql, query, { doc, col })
    } else {
      aql = this.parseForIn(aql, query, { doc, col })
    }
    return aql
  }

  async parseQuery(query) {
    const ModelCls = this.orango.model(query.model)
    const col = ModelCls.collectionName
    const doc = query.name || pluralize.singular(col || 'result') // the doc id
    const refs = { doc, col }

    // convert @doc @col
    if (query.data) {
      let queryStr = JSON.stringify(query.data)
      queryStr = aqlFuncs.parseRefs(refs, queryStr)
      query.data = JSON.parse(queryStr)
    }

    let aql = await this.parseInitialOperations(query, refs)
    aql = this.parseLets(aql, query, refs)
    aql = await this.parseQueries(aql, query, refs)
    aql = await this.parseOperations(aql, query, refs)
    aql = this.parseReturn(aql, query, refs)
    return { aql }
  }
}

module.exports = function(orango) {
  return new QueryToAQL(orango)
}
