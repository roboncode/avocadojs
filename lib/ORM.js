const Builder = require('../tang/Builder')
const sortToAQL = require('./helpers/sortToAQL')
const returnToAQL = require('./helpers/returnToAQL')
const criteriaBuilder = require('./helpers/criteriaBuilder')
const asyncForEach = require('../tang/helpers/asyncForEach')
const setDefaultsToNull = require('./helpers/setDefaultsToNull')
const arrayOverride = require('./helpers/arrayOverride')
const lodashGet = require('lodash/get')
const lodashSet = require('lodash/set')
const jsonStringify = require('../tang/helpers/jsonStringify')
const DOC_VAR = 'doc'
const EXPR = /"expr\([\s+]?([\w\s.+-]+)\)"/gi
require('colors')

async function iterateHandler(val, prop, target, path) {
  switch (typeof val) {
    case 'object':
      if (!(val instanceof Array)) {
        if (val.$inc != undefined) {
          target[prop] = 'EXPR(' + path.join('.') + '+' + val.$inc + ')'
        } else {
          await asyncForEach(val, iterateHandler, path)
        }
      }
      break
    case 'string':
      if (val.match(/[+-=]{2}\s?\d/gi)) {
        target[prop] = 'EXPR(' + path.join('.') + val[0] + val.substr(2) + ')'
      }
      break
  }
}

class ORM {
  constructor() {
    this.aqlSegments = []
    this._counter = 0
    this._offset = 0
    this._criteria = {}
    this._separator = ''
    this._schemaOptions = {}
  }

  model(val) {
    this._model = val
    return this
  }

  connection(val) {
    this._connection = val
    return this
  }

  collection(val) {
    this._collection = val
    return this
  }

  criteria(val) {
    this._criteria = val
    return this
  }

  query(val) {
    this._query = val
    return this
  }

  schemaOptions(val) {
    this._schemaOptions = val
    return this
  }

  options(val) {
    this._options = val
    return this
  }

  action(val) {
    this._action = val
    return this
  }

  data(val) {
    this._data = val
    return this
  }

  computed(val) {
    this._computed = val
    return this
  }

  offset(val) {
    this._offset = val
    return this
  }

  limit(val) {
    this._limit = val
    return this
  }

  sort(val) {
    this._sort = val
    return this
  }

  select(val) {
    this._select = val
    return this
  }

  async toAQL(pretty = false) {
    this._separator = pretty ? '\n   ' : ''

    if (this._action === 'find') {
      return this._createFindQuery()
    }

    if (this._action === 'findEdge') {
      return this._createEdgeQuery()
    }

    if (this._action === 'update') {
      await this._createUpdateQuery()
      return this._createAQLQuery()
    }

    if (this._action === 'delete') {
      return this._createDeleteQuery()
    }
  }

  exec() {
    this._separator = '\n   '

    if (this._action === 'find') {
      return this._find()
    }

    if (this._action === 'findEdge') {
      return this._findEdgebound()
    }

    if (this._action === 'update') {
      return this._update()
    }

    if (this._action === 'delete') {
      return this._delete()
    }
  }

  _createAQLForIn() {
    this.aqlSegments.push('FOR', DOC_VAR, 'IN', this._collection.name)
  }

  _createAQLCustom() {
    let query = this._query
      .split('@@doc')
      .join(DOC_VAR)
      .split('@@collection')
      .join(this._collection.name)
    this.aqlSegments.push(query)
  }

  _createAQLForInBound() {
    this.aqlSegments.push(
      'FOR',
      DOC_VAR,
      'IN',
      this._criteria.inbound ? 'INBOUND' : 'OUTBOUND',
      `"${this._criteria.id}"`,
      this._criteria.collection
    )
  }

  _createAQLFilter() {
    if (Object.keys(this._criteria).length) {
      this.aqlSegments.push(
        this._separator + 'FILTER',
        criteriaBuilder(this._criteria, DOC_VAR)
      )
    }
  }

  _createAQLLimit() {
    if (this._offset || this._limit) {
      this.aqlSegments.push(
        this._separator + 'LIMIT ' + this._offset + ',' + this._limit
      )
    }
  }

  _createAQLSort() {
    if (this._sort) {
      this.aqlSegments.push(
        this._separator + 'SORT ' + sortToAQL(this._sort, DOC_VAR)
      )
    }
  }

  _createAQLOptions() {
    let opts = {}
    let hasOptions = false
    if (this._schemaOptions.hasOwnProperty('keepNull')) {
      opts.keepNull = false
      hasOptions = true
    }
    if (hasOptions) {
      this.aqlSegments.push('OPTIONS', JSON.stringify(opts))
    }
  }

  _createAQLReturn(distinct = false) {
    const returnItems = this._select
      ? returnToAQL(this._select, DOC_VAR)
      : DOC_VAR
    this.aqlSegments.push(
      this._separator + 'RETURN' + (distinct ? ' DISTINCT' : ''),
      returnItems
    )
  }

  _createAppendSubdocs(arrayPaths, data) {
    let subdocs = {}
    delete data._key
    delete data._id
    delete data._rev

    for (let i = 0; i < arrayPaths.length; i++) {
      let items = lodashGet(data, arrayPaths[i])
      for (let n = items.length - 1; n >= 0; n--) {
        if (!items[n].isNew) {
          items.splice(n, 1)
        } else {
          delete items[n].isNew
        }
      }
      if (items.length) {
        let uid = this._counter++
        let path = arrayPaths[i]
        let json = jsonStringify(items)
        let aql =
          this._separator +
          `LET subdoc_${uid} = APPEND(${DOC_VAR}.${path}, ${json})`
        this.aqlSegments.push(aql)
        lodashSet(subdocs, path, 'subdoc_' + uid)
      }
    }
    Object.assign(data, subdocs)
  }

  _createAQLUpdate() {
    const removeOnMatchDefault = this._schemaOptions.removeOnMatchDefault
    const arrayPaths = this._model.schema._arrayPaths
    return new Promise(async (resolve, reject) => {
      const result = await Builder.getInstance()
        .data(this._data)
        .convertTo(this._model)
        .intercept(data => {
          this._createAppendSubdocs(arrayPaths, data)
          return data
        })
        .toObject({
          noDefaults: true,
          // noDefaults: this._options.noDefaults || false,
          unknownProps: this._schemaOptions.strict ? 'strip' : 'allow'
        })
        .intercept(async data => {
          await asyncForEach(data, iterateHandler)
          return data
        })
        .intercept(async data => {
          if (removeOnMatchDefault) {
            const defaultValues = this._model.schema.defaultValues
            data = await setDefaultsToNull(data, defaultValues)
          }
          return data
        })
        .exec()

      if (result instanceof Error) {
        return reject(result)
      }
      this.aqlSegments.push(
        this._separator + 'UPDATE',
        DOC_VAR,
        this._separator + 'WITH',
        JSON.stringify(result).replace(/"(subdoc\w+)"/g, '$1')
      )
      this.aqlSegments.push(this._separator + 'IN', this._collection.name)
      let query = this._createAQLQuery()
      console.log(query)
      // resolve(query)
      resolve()
    })
  }

  _createAQLRemove() {
    this.aqlSegments.push(this._separator + 'REMOVE', DOC_VAR)
    this.aqlSegments.push(this._separator + 'IN', this._collection.name)
  }

  _createAQLQuery() {
    return this.aqlSegments.join(' ').replace(EXPR, DOC_VAR + '.$1')
  }

  _createFindQuery() {
    if (this._query) {
      this._createAQLCustom()
    } else {
      this._createAQLForIn()
      this._createAQLFilter()
    }
    this._createAQLLimit()
    this._createAQLSort()
    this._createAQLReturn()

    return this._createAQLQuery()
  }

  _find() {
    return new Promise(async resolve => {
      const query = this._createFindQuery()

      this._print(query)

      // perform query
      let cursor = await this._connection.db.query(query)
      let docs = await cursor.all()
      let builder = Builder.getInstance()
        .data(docs)
        .convertTo(this._model)

      if (!this._options.returnModel) {
        builder
          .toObject({
            computed: this._computed,
            noDefaults: this._options.noDefaults || false,
            unknownProps: this._schemaOptions.strict ? 'strip' : 'allow'
          })
          .intercept(target => {
            delete target._key
            return target
          })
      }

      let result = await builder.exec()

      const arrPaths = this._model.schema._arrayPaths

      if (result && this._options.returnSingle) {
        for (let i = 0; i < arrPaths.length; i++) {
          let arr = lodashGet(result[0], arrPaths[i])
          arrayOverride(arr)
        }

        return resolve(result[0])
      }

      return resolve(result)
    })
  }

  async _createEdgeQuery() {
    this._createAQLForInBound()
    this._createAQLReturn(true)

    return this._createAQLQuery()
  }

  _findEdgebound() {
    return new Promise(async resolve => {
      const query = await this._createEdgeQuery()

      this._print(query)

      // perform query
      let cursor = await this._connection.db.query(query)
      let docs = await cursor.all()
      let result = await Builder.getInstance()
        .data(docs)
        .convertTo(this._model)
        .toObject({
          computed: this._computed,
          noDefaults: this._options.noDefaults || false,
          unknownProps: this._schemaOptions.strict ? 'strip' : 'allow'
        })
        .intercept(target => {
          delete target._key
          return target
        })
        .exec()

      if (this._limit === 1 && result) {
        return resolve(result[0])
      }

      return resolve(result)
    })
  }

  async _createUpdateQuery() {
    this._createAQLForIn()
    this._createAQLFilter()
    this._createAQLLimit()
    this._createAQLSort()
    await this._createAQLUpdate()
    this._createAQLOptions()
    return this._createAQLQuery()
  }

  _update() {
    return new Promise(async resolve => {
      const query = await this._createUpdateQuery()

      this._print(query)

      await this._connection.db.query(query)

      return resolve()
    })
  }

  _createDeleteQuery() {
    this._createAQLForIn()
    this._createAQLFilter()
    this._createAQLLimit()
    this._createAQLSort()
    this._createAQLRemove()

    return this._createAQLQuery()
  }

  _delete() {
    return new Promise(async resolve => {
      const query = this._createDeleteQuery()

      this._print(query)

      let cursor = await this._connection.db.query(query)
      let docs = await cursor.all()
      return resolve(docs)
    })
  }

  _print(query) {
    // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    // https://misc.flogisoft.com/bash/tip_colors_and_formatting
    if (this._options.printAQL) {
      if (this._options.printAQL === 'color') {
        query = query.replace(/\b([A-Z]+)\b/g, '\x1b[36m$1\x1b[0m')
      }
      console.log('\n' + query + '\n')
    }
  }
}

module.exports = ORM
