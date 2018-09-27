const { Builder } = require('tangjs')
const { asyncForEach, jsonStringify } = require('tangjs/lib/helpers')
const sortToAQL = require('./helpers/sortToAQL')
const returnToAQL = require('./helpers/returnToAQL')
const criteriaBuilder = require('./helpers/criteriaBuilder')
const setDefaultsToNull = require('./helpers/setDefaultsToNull')
const arrayOverride = require('./helpers/arrayOverride')
const createUniqueId = require('./helpers/createUniqueId')
const lodashGet = require('lodash/get')
const lodashSet = require('lodash/set')
const lodashUnset = require('lodash/unset')
const EXPR = /"expr\([\s+]?([\w\s.+-]+)\)"/gi
require('colors')

async function convertToAQLExpression(val, prop, target, path) {
  delete target._id
  delete target._key
  delete target._rev

  switch (typeof val) {
    case 'object':
      if (!(val instanceof Array)) {
        if (val.$inc != undefined) {
          target[prop] = 'EXPR(' + path.join('.') + '+' + val.$inc + ')'
        } else {
          await asyncForEach(val, convertToAQLExpression, path)
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
    this._doc = 'doc'
    this._counter = 0
    this._offset = 0
    this._noDefaults = true
    this._criteria = {}
    this._separator = ''
    this._schemaOptions = {}
    this._options = {}
    this._subdocsOptions = {
      pulls: {},
      ignores: {}
    }
    this._intercepts = []
    this._populates = []
    this._vars = {}
  }

  id() {
    this._id = true
    return this
  }

  doc(val = 'doc') {
    this._doc = val
    return this
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

  criteria(val = {}) {
    this._criteria = val
    return this
  }

  withDefaults(val = true) {
    this._noDefaults = !val
    return this
  }

  query(val) {
    this._query = val
    return this
  }

  schemaOptions(val = {}) {
    this._schemaOptions = val
    return this
  }

  options(val = {}) {
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

  return(val) {
    this._return = val
    return this
  }

  intercept(cb) {
    this._intercepts.push(cb)
    return this
  }

  var(name, Model, id) {
    this._vars[name] = {
      Model,
      id
    }
    return this
  }

  populate(property, documentOrModel, options = {}) {
    this._populates.push({
      property,
      documentOrModel,
      options
    })
    return this
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject)
  }

  async toAQL(options = {}) {
    if (options.pretty) {
      this._separator = '\n   '
    }

    // this._colorize = options.pretty === 'color'

    if (this._action === 'insert') {
      return this._createInsertQuery()
    }

    if (this._action === 'find') {
      return this._createFindQuery()
    }

    if (this._action === 'findEdge') {
      return this._createEdgeQuery()
    }

    if (this._action === 'update') {
      return await this._createUpdateQuery()
      // return this._createAQLQuery()
    }

    if (this._action === 'delete') {
      return this._createDeleteQuery()
    }

    if (this._action === 'count') {
      return this._createCountQuery()
    }
  }

  exec() {
    this._separator = '\n   '

    if (this._action === 'insert') {
      return this._insert()
    }

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

    if (this._action === 'count') {
      return this._count()
    }

  }

  _createAQLInitCount(prop = 'count') {
    this.aqlSegments.push(`LET ${prop} = COUNT(`)
  }

  _createAQLReturnCount(prop = 'count') {
    this.aqlSegments.push(`RETURN 1) RETURN { ${prop} }`)
  }

  _createAQLDocuments() {
    for (let name in this._vars) {
      if (this._vars.hasOwnProperty(name)) {
        let doc = this._vars[name]
        let documentId = doc.Model.documentId(doc.id)
        this.aqlSegments.push(`LET ${name} = DOCUMENT('${documentId}') `)
      }
    }
  }

  _createAQLForIn() {
    this.aqlSegments.push('FOR', this._doc, 'IN', this._collection.name)
  }

  _createAQLCustom() {
    let query = this._query
      .split('@@doc')
      .join(this._doc)
      .split('@@collection')
      .join(this._collection.name)
    this.aqlSegments.push(query)
  }

  _createAQLForInBound() {
    this.aqlSegments.push(
      'FOR',
      this._doc,
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
        criteriaBuilder(this._criteria, this._doc)
      )
    }
  }

  _createAQLLimit() {
    if (this._offset || this._limit) {
      const offset = this._offset || 0
      const limit = this._limit || 100
      this.aqlSegments.push(this._separator + 'LIMIT ' + offset + ',' + limit)
    }
  }

  _createAQLSort() {
    if (this._sort) {
      this.aqlSegments.push(
        this._separator + 'SORT ' + sortToAQL(this._sort, this._doc)
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

  _createAQLPopulates() {
    let mergeItem = {}
    for (let i = 0; i < this._populates.length; i++) {
      let populate = this._populates[i]
      let _prop = populate.property.split('.').join('_')
      if (populate.options.select) {
        let dm = populate.documentOrModel
        if (typeof dm !== 'string') {
          this.aqlSegments.push(
            `LET ${_prop} = DOCUMENT(CONCAT('${dm.collectionName}/', doc.${
              populate.property
            }))`
          )
        }
        if (populate.options.select) {
          let keepProps =
            "'" + populate.options.select.split(' ').join("', '") + "'"
          lodashSet(
            mergeItem,
            populate.property,
            `KEEP(${_prop}, ${keepProps})`
          )
        }
      } else {
        lodashSet(mergeItem, populate.property, _prop)
      }
    }
    mergeItem = JSON.stringify(mergeItem)
      .split('"')
      .join('')
    this.aqlSegments.push(
      this._separator + `RETURN MERGE(${this._doc}, ${mergeItem})`
    )
  }

  _createAQLReturn(distinct = false) {
    if (this._options.returnNew && this._options.returnOld) {
      this.aqlSegments.push('RETURN { old: OLD, new: NEW }')
    } else if (this._options.returnNew) {
      this.aqlSegments.push('RETURN NEW')
    } else if (this._options.returnOld) {
      this.aqlSegments.push('RETURN OLD')
    } else if (this._return) {
      this.aqlSegments.push('RETURN', this._separator + this._return)
    } else if (this._populates.length) {
      this._createAQLPopulates()
    } else {
      const returnItems = this._select
        ? returnToAQL(this._select, this._doc)
        : this._doc
      this.aqlSegments.push(
        this._separator + 'RETURN' + (distinct ? ' DISTINCT' : ''),
        returnItems
      )
    }
  }

  /**
   * Parses subdocs and determines if items should be appended, removed or replaced
   * @param {*} arrayPaths
   * @param {*} data
   */
  _parseSubdocs(arrayPaths, data) {
    for (let i = 0; i < arrayPaths.length; i++) {
      const PATH_DOT = arrayPaths[i]
      let isNew = false
      let items = lodashGet(data, PATH_DOT)
      if (items && (items.isOverridden || items.$push || items.$pull)) {
        try {
          if (items.$push) {
            isNew = true
            items = items.$push
          }
        } catch (e) {}

        try {
          let pulls = items.pulls || items.$pull
          if (items.pulls || items.$pull) {
            this._subdocsOptions.pulls[PATH_DOT] = pulls
          }
        } catch (e) {}

        let subdocs = []
        if (items.length) {
          if (jsonStringify(items).indexOf('{') === -1) {
            subdocs = items
          } else {
            for (let i = 0; i < items.length; i++) {
              if (isNew || items[i].isNew) {
                items[i].$id = createUniqueId()
                subdocs.push(items[i])
              }
            }
          }
        }
        if (subdocs.length) {
          lodashSet(data, PATH_DOT, subdocs)
        } else {
          lodashUnset(data, PATH_DOT)
        }
      } else {
        this._subdocsOptions.ignores[PATH_DOT] = true
      }
    }
  }

  async _createAQLSubdocs(arrayPaths, data) {
    for (let i = 0; i < arrayPaths.length; i++) {
      const PATH_DOT = arrayPaths[i]
      const PATH_VAR = PATH_DOT.split('.').join('_')
      if (this._subdocsOptions.ignores[PATH_DOT]) {
        continue
      }
      let pullCriteria = this._subdocsOptions.pulls[PATH_DOT]
      let items = lodashGet(data, PATH_DOT) || []
      try {
        // if (items.$pull) {
        // pullCriteria = jsonStringify(items.$pull)
        // }
        if (items.$push) {
          isNew = true
          items = items.$push
        }
      } catch (e) {}

      let aql = `${this._doc}.${PATH_DOT}`

      // check if there are pulls
      if (pullCriteria) {
        // FOR doc IN users FILTER ((doc.`name` == "rob") OR (doc.`name` == "john")) RETURN doc
        // TODO: This needs to be refactored but just trying to get it working for now
        if (pullCriteria instanceof Array) {
          let ids = JSON.stringify(pullCriteria)
          aql =
            `MINUS(${this._doc}.${PATH_DOT}, ( ` +
            this._separator +
            `FOR item IN ${this._doc}.${PATH_DOT} || [] ` +
            this._separator +
            `FOR id IN ${ids} ` +
            this._separator +
            `FILTER item.$id == id ` +
            this._separator +
            `RETURN item` +
            this._separator +
            `))`
        } else {
          let orm = new ORM()
          orm.action('find')
          orm.doc('item')
          orm.collection({
            name: `${this._doc}.${PATH_DOT}`
          })
          orm.criteria(pullCriteria)
          let subquery = await orm.toAQL()

          aql =
            `MINUS(${this._doc}.${PATH_DOT}, ( ` +
            this._separator +
            subquery +
            this._separator +
            `))`
        }
      }

      // check if there are pushes
      if (items.length) {
        let subdocsJSON = jsonStringify(items)
        aql = `APPEND(${aql}, ${subdocsJSON})`
      }

      // if there are pulls or pushes
      if (pullCriteria || items.length) {
        aql = `LET ${PATH_VAR} = ${aql}`
        this.aqlSegments.push(aql)
        lodashSet(data, PATH_DOT, '%' + PATH_VAR + '%')
      }
    }
  }

  _createAQLUpdate() {
    const removeOnMatchDefault = this._schemaOptions.removeOnMatchDefault
    const arrayPaths = this._model.schema._arrayPaths
    return new Promise(async (resolve, reject) => {
      const result = await Builder.getInstance()
        .data(this._data)
        .convertTo(this._model)
        .intercept(data => {
          this._parseSubdocs(arrayPaths, data)
          return data
        })
        .toObject({
          noDefaults: !this._options.withDefaults,
          // noDefaults: this._options.noDefaults || false,
          unknownProps: this._schemaOptions.strict ? 'strip' : 'allow'
        })
        .intercept(async data => {
          await asyncForEach(data, convertToAQLExpression)
          return data
        })
        .intercept(async data => {
          if (removeOnMatchDefault) {
            const defaultValues = this._model.schema.defaultValues
            data = await setDefaultsToNull(data, defaultValues)
          }
          return data
        })
        .intercept(async data => {
          await this._createAQLSubdocs(arrayPaths, data)
          return data
        })
        .build()

      if (result instanceof Error) {
        return reject(result)
      }
      let SPECIAL_TAG = JSON.stringify(result).replace(/"%(\w+)%"/g, '$1')
      this.aqlSegments.push(`UPDATE ${this._doc} WITH ${SPECIAL_TAG}`)
      this.aqlSegments.push('IN ' + this._collection.name)
      resolve()
    })
  }

  _createAQLRemove() {
    this.aqlSegments.push('REMOVE ' + this._doc)
    this.aqlSegments.push('IN ' + this._collection.name)
  }

  _createAQLQuery() {
    let query = this.aqlSegments.join(' ').replace(EXPR, this._doc + '.$1')
    // if (colorize) {
    //   query = query.replace(/\b([A-Z]+)\b/g, '\x1b[36m$1\x1b[0m')
    // }
    return query
  }

  _createInsertQuery() {
    return 'NEW DOCUMENT'
  }

  _createFindQuery() {
    if (this._query) {
      this._createAQLCustom()
    } else {
      this._createAQLDocuments()
      this._createAQLForIn()
      this._createAQLFilter()
    }
    this._createAQLSort()
    this._createAQLLimit()
    this._createAQLReturn()

    return this._createAQLQuery()
  }

  _createCountQuery() {
    this._createAQLInitCount('count')
    if (this._query) {
      this._createAQLCustom()
    } else {
      this._createAQLForIn()
      this._createAQLFilter()
    }
    this._createAQLSort()
    this._createAQLLimit()
    this._createAQLReturnCount('count')

    return this._createAQLQuery()
  }

  _createPopulateIntercepts(builder) {
    if (this._populates.length) {
      for (let i = 0; i < this._populates.length; i++) {
        let populate = this._populates[i]
        builder.intercept(async doc => {
          let item = lodashGet(doc, populate.property)
          let dm = populate.documentOrModel
          let Model = typeof dm === 'string' ? this._vars[dm].Model : dm
          let newItem = await new Model(item).toObject({
            noDefaults: populate.options.noDefaults,
            computed: populate.options.computed
          })
          lodashSet(doc, populate.property, newItem)
          return doc
        })
      }
    }
  }

  _createCustomIntercepts(builder) {
    for (let i = 0; i < this._intercepts.length; i++) {
      builder.intercept(this._intercepts[i])
    }
  }

  _insert() {
    this._model.emit('insert', {
      model: this._model,
      data: this._data,
      orm: this
    })

    const promise = new Promise(async (resolve, reject) => {
      try {
        let builder = Builder.getInstance()
          .data(this._data)
          .convertTo(this._model)
          .toObject({
            noDefaults: true,
            unknownProps: this._schemaOptions.strict ? 'strip' : 'allow'
          })
        let data = await builder.build()
        if (data) {
          let doc
          doc = await this._collection.save(data, {
            returnNew: this._options.returnNew
          })
          if (this._id) {
            doc.id = doc._key
            delete doc._key
            delete doc._id
            delete doc._rev
          }

          Object.assign(this._data, doc)
          return resolve(this._datda)
        }
      } catch (e) {
        return reject(e)
      }
    })

    promise.then(
      data => {
        if (data) {
          this._model.emit('inserted', {
            model: this._model,
            data,
            orm: this
          })
        }
      },
      // prevents Unhandled error warnings
      () => {
        // do nothing
      }
    )

    return promise
  }

  _find() {
    return new Promise(async (resolve, reject) => {
      try {
        const query = this._createFindQuery()

        this._print(query)

        // perform query
        let cursor = await this._connection.db.query(query)
        let docs = await cursor.all()
        let builder = Builder.getInstance().data(docs)

        if (!this._options.returnModel) {
          builder
            .convertTo(this._model)
            .toObject({
              computed: this._computed,
              noDefaults: this._noDefaults
              // unknownProps: this._schemaOptions.strict ? 'strip' : 'allow'
            })
            .intercept(target => {
              if (this._id) {
                target.id = target._key
                delete target._key
                delete target._id
                delete target._rev
              }
              return target
            })
        }

        this._createPopulateIntercepts(builder)

        this._createCustomIntercepts(builder)

        let result = await builder.build()

        const arrPaths = this._model.schema._arrayPaths

        if (result && this._options.returnSingle) {
          for (let i = 0; i < arrPaths.length; i++) {
            let arr = lodashGet(result[0], arrPaths[i])
            arrayOverride(arr)
          }

          return resolve(result[0])
        }

        return resolve(result)
      } catch (e) {
        return reject(e.message)
      }
    })
  }

  _count() {
    return new Promise(async (resolve, reject) => {
      try {
        const query = this._createCountQuery()

        this._print(query)

        // perform query
        let cursor = await this._connection.db.query(query)
        let result = await cursor.next()
        return resolve(result.count)
      } catch (e) {
        return reject(e.message)
      }
    })
  }

  async _createEdgeQuery() {
    this._createAQLForInBound()
    this._createAQLReturn(true)

    return this._createAQLQuery()
  }

  _findEdgebound() {
    return new Promise(async (resolve, reject) => {
      try {
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
            noDefaults: this._noDefaults,
            unknownProps: this._schemaOptions.strict ? 'strip' : 'allow'
          })
          // .intercept(target => {
          //   delete target._key
          //   return target
          // })
          .build()

        if (this._limit === 1 && result) {
          return resolve(result[0])
        }

        return resolve(result)
      } catch (e) {
        return reject(e.message)
      }
    })
  }

  async _createUpdateQuery() {
    let returnVal = this._options.returnNew || this._options.returnOld
    if (!returnVal) {
      this._createAQLInitCount('modified')
    }
    this._createAQLForIn()
    this._createAQLFilter()
    this._createAQLSort()
    this._createAQLLimit()
    await this._createAQLUpdate()
    this._createAQLOptions()
    if (returnVal) {
      this._createAQLReturn()
    } else {
      this._createAQLReturnCount('modified')
    }
    return this._createAQLQuery()
  }

  _update() {
    this._model.emit('update', {
      model: this._model,
      data: this._data,
      orm: this
    })

    const promise = new Promise(async (resolve, reject) => {
      try {
        const query = await this._createUpdateQuery()
        let returnVal = this._options.returnNew || this._options.returnOld

        this._print(query)

        let cursor = await this._connection.db.query(query)
        let result
        if (this._options.returnSingle || !returnVal) {
          result = await cursor.next()
          return resolve(result)
        }
        result = await cursor.all()
        return resolve(result)
      } catch (e) {
        return reject(e.message)
      }
    })

    promise.then(data => {
      this._model.emit('updated', {
        model: this._model,
        data,
        orm: this
      })
    })

    return promise
  }

  _createDeleteQuery() {
    this._createAQLInitCount('deleted')
    this._createAQLForIn()
    this._createAQLFilter()
    this._createAQLSort()
    this._createAQLLimit()
    this._createAQLRemove()
    this._createAQLReturnCount('deleted')

    return this._createAQLQuery()
  }

  _delete() {
    this._model.emit('delete', {
      model: this._model,
      orm: this
    })

    const promise = new Promise(async (resolve, reject) => {
      try {
        const query = this._createDeleteQuery()

        this._print(query)

        let cursor = await this._connection.db.query(query)
        if (this._options.returnSingle) {
          return resolve(cursor.next())
        }
        let docs = await cursor.all()
        return resolve(docs)
      } catch (e) {
        return reject(e.message)
      }
    })

    promise.then(docs => {
      this._model.emit('deleted', {
        model: this._model,
        data: docs,
        orm: this
      })
    })

    return promise
  }

  _print(query) {
    // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    // https://misc.flogisoft.com/bash/tip_colors_and_formatting
    if (this._options.printAQL) {
      // if (this._colorize) {
      //   query = query.replace(/\b([A-Z]+)\b/g, '\x1b[36m$1\x1b[0m')
      // }
      console.log('\n' + query + '\n')
    }
  }
}

module.exports = ORM
