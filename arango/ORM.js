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

  exec() {
    if (this._action === 'find') {
      return this._find()
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

  _createAQLFilter() {
    if (Object.keys(this._criteria).length) {
      this.aqlSegments.push(
        '\n   FILTER',
        criteriaBuilder(this._criteria, DOC_VAR)
      )
    }
  }

  _createAQLLimit() {
    if (this._offset || this._limit) {
      this.aqlSegments.push('\n   LIMIT ' + this._offset + ',' + this._limit)
    }
  }

  _createAQLSort() {
    if (this._sort) {
      this.aqlSegments.push('\n   SORT ' + sortToAQL(this._sort, DOC_VAR))
    }
  }

  _createAQLReturn() {
    const returnItems = this._select
      ? returnToAQL(this._select, DOC_VAR)
      : DOC_VAR
    this.aqlSegments.push('\n   RETURN', returnItems)
  }

  _createAQLUpdate() {
    return new Promise(async resolve => {
      console.log('data'.bgRed, this._data)
      const result = await Builder.getInstance()
        .data(this._data)
        .convertTo(this._model)
        .intercept(async data => {
          console.log('intercept'.cyan, data)
          await asyncForEach(data, iterateHandler)
          return data
        })
        .toObject({
          noDefaults: this._options.noDefaults || false,
          unknownProps: this._schemaOptions.strict ? 'strip' : 'allow'
        })
        .exec()
      console.log('result'.bgMagenta, result)
      if (result instanceof Error) {
        return reject(result)
      }
      this.aqlSegments.push(
        '\n   UPDATE',
        DOC_VAR,
        '\n   WITH',
        JSON.stringify(result)
      )
      this.aqlSegments.push('\n   IN', this._collection.name)
      resolve()
    })
  }

  _createAQLRemove() {
    this.aqlSegments.push('\n   REMOVE', DOC_VAR)
    this.aqlSegments.push('\n   IN', this._collection.name)
  }

  _createAQLQuery() {
    return this.aqlSegments.join(' ').replace(EXPR, DOC_VAR + '.$1')
  }

  _find() {
    return new Promise(async resolve => {
      this._createAQLForIn()
      this._createAQLFilter()
      this._createAQLLimit()
      this._createAQLSort()
      this._createAQLReturn()

      const query = this._createAQLQuery()
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

  _update() {
    return new Promise(async resolve => {
      this._createAQLForIn()
      this._createAQLFilter()
      this._createAQLLimit()
      this._createAQLSort()
      await this._createAQLUpdate()

      const query = this._createAQLQuery()
      console.log(query)
      // await this.connection.db.query(query)

      // return resolve()
    })
  }

  _delete() {
    return new Promise(async resolve => {
      this._createAQLForIn()
      this._createAQLFilter()
      this._createAQLLimit()
      this._createAQLSort()
      this._createAQLRemove()

      const query = this._createAQLQuery()
      console.log('#delete', query)
      if (this._options.printAQL) {
        console.log(query)
      }

      // await this._connection.db.query(query)

      // return resolve()

      let cursor = await this._connection.db.query(query)
      let docs = await cursor.all()
      return resolve(docs)
      // let result = await Builder.getInstance()
      //   .data(docs)
      //   .convertTo(this._model)
      //   .toObject({
      //     computed: this._computed,
      //     noDefaults: this._options.noDefaults || false,
      //     unknownProps: this._schemaOptions.strict ? 'strip' : 'allow'
      //   })
      //   .exec()

      // if (this._limit === 1 && result) {
      //   return resolve(result[0])
      // }

      // return resolve(result)
    })
  }
}

module.exports = ORM
