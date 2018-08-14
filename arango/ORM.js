const Builder = require('../avocado/Builder')
const sortToAQL = require('./helpers/sortToAQL')
const returnToAQL = require('./helpers/returnToAQL')
const criteriaBuilder = require('./helpers/criteriaBuilder')
const DOC_VAR = 'doc'
const EXPR = /"expr\([\s+]?([\w\s.+-]+)\)"/gi

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
    let result
    switch (this._action) {
      case 'find':
        return this._find()
        break
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
    const returnItems = this._select ? returnToAQL(this._select, DOC_VAR) : DOC_VAR
    this.aqlSegments.push('\n   RETURN', returnItems)
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
}

module.exports = ORM
