const Builder = require('../avocado/Builder')
const sortToAQL = require('./helpers/sortToAQL')
const returnToAQL = require('./helpers/returnToAQL')
const criteriaBuilder = require('./helpers/criteriaBuilder')
const asyncForEach = require('../avocado/helpers/asyncForEach')
const DOC_VAR = 'doc'
const EXPR = /"expr\([\s+]?([\w\s.+-]+)\)"/gi
require('colors')

async function iterateHandler(val, prop, target, path) {
  switch (typeof val) {
    case 'object':
      if (!(val instanceof Array)) {
        if (val.$inc != undefined) {
          target[prop] = 'EXPR(' + path.join('.') + val.$inc + ')'
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
    this._offset = 0
    this._criteria = {}
    this._separator = ''
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

  schemaOptions(val) {
    this._schemaOptions = val
    return this
  }

  options(val) {
    this._options = val
    return this
  }

  action(val, options = {}) {
    this._action = val
    this._actionOptions = options
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

  toQuery(pretty = false) {
    this._separator = pretty ? '\n   ' : ''

    if (this._action === 'find') {
      return this._createFindQuery()
    }

    if (this._action === 'findOut') {
      return this._createOutboundQuery()
    }

    if (this._action === 'update') {
      return this._createUpdateQuery()
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

    if (this._action === 'findOut') {
      return this._findOutbound()
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

  _createAQLForInOutbound() {
    this.aqlSegments.push(
      'FOR',
      DOC_VAR,
      'IN OUTBOUND',
      `"${this._actionOptions.id}"`,
      this._actionOptions.edgeCollectionName
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

  _createAQLReturn(distinct = false) {
    const returnItems = this._select
      ? returnToAQL(this._select, DOC_VAR)
      : DOC_VAR
    this.aqlSegments.push(
      this._separator + 'RETURN',
      distinct ? 'DISTINCT' : '',
      returnItems
    )
  }

  _createAQLUpdate() {
    return new Promise(async resolve => {
      const result = await Builder.getInstance()
        .data(this._data)
        .convertTo(this._model)
        .intercept(async data => {
          await asyncForEach(data, iterateHandler)
          return data
        })
        .toObject({
          noDefaults: true,
          // noDefaults: this._options.noDefaults || false,
          unknownProps: this._schemaOptions.strict ? 'strip' : 'allow'
        })
        .exec()

      if (result instanceof Error) {
        return reject(result)
      }
      this.aqlSegments.push(
        this._separator + 'UPDATE',
        DOC_VAR,
        this._separator + 'WITH',
        JSON.stringify(result)
      )
      this.aqlSegments.push(this._separator + 'IN', this._collection.name)
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
    this._createAQLForIn()
    this._createAQLFilter()
    this._createAQLLimit()
    this._createAQLSort()
    this._createAQLReturn()

    return this._createAQLQuery()
  }

  _find() {
    return new Promise(async resolve => {
      const query = this._createFindQuery()
      if (this._options.printAQL) {
        console.log(query)
      }

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
        .exec()

      if (this._limit === 1 && result) {
        return resolve(result[0])
      }

      return resolve(result)
    })
  }

  async _createOutboundQuery() {
    this._createAQLForInOutbound()
    this._createAQLReturn(true)

    return this._createAQLQuery()
  }

  _findOutbound() {
    return new Promise(async resolve => {
      const query = await this._createOutboundQuery()

      if (this._options.printAQL) {
        console.log(query)
      }

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
    return await this._createAQLUpdate()
  }

  _update() {
    return new Promise(async resolve => {
      const query = await this._createUpdateQuery()

      if (this._options.printAQL) {
        console.log(query)
      }

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

      if (this._options.printAQL) {
        console.log(query)
      }

      let cursor = await this._connection.db.query(query)
      let docs = await cursor.all()
      return resolve(docs)
    })
  }
}

module.exports = ORM
