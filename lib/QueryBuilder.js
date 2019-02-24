const ReturnBuilder = require('./ReturnBuilder')

class QueryBuilder {
  constructor(query = {}) {
    this.q = query
    this.q.__internal = true
  }

  name(val) {
    this.q.name = val
    return this
  }

  byId(id) {
    this.where({
      _key: id + ''
    })
    this.return(new ReturnBuilder().one())
    return this
  }

  where(val) {
    this.q.where = val
    return this
  }

  offset(val = 0) {
    this.q.offset = val
    return this
  }

  limit(val = 1) {
    this.q.limit = val
    return this
  }

  sort(val) {
    this.q.sort = val
    return this
  }

  one() {
    this.limit()
    this.return(new ReturnBuilder().one())
    return this
  }

  outbound(target, id, options = {}) {
    this.q.vertex = {
      direction: 'outbound',
      target,
      id,
      options
    }
    return this
  }

  inbound(target, id, options = {}) {
    this.q.vertex = {
      direction: 'inbound',
      target,
      id,
      options
    }
    return this
  }

  withDefaults(val = true) {
    this.q.withDefaults = val
    return this
  }

  let(key, value) {
    if (!this.q.lets) {
      this.q.lets = {}
    }
    this.q.lets[key] = value
    return this
  }

  select(val = '') {
    if (val) {
      this.q.select = val
    } else {
      delete this.q.select
    }
    return this
  }

  query(...opts) {
    if (!this.q.queries) {
      this.q.queries = []
    }
    if (typeof opts[0] === 'string') {
      if (opts[1] instanceof QueryBuilder) {
        this.q.queries.push({
          let: opts[0],
          query: opts[1].toJSON()
        })
      } else {
        throw new Error('query must be an instance of QueryBuilder')
      }
    } else {
      if (opts[0] instanceof QueryBuilder) {
        this.q.queries.push({
          query: opts[0].toJSON()
        })
      } else {
        throw new Error('query must be an instance of QueryBuilder')
      }
    }
    return this
  }

  return(val = true) {
    this.q.return = val
    return this
  }

  getQuery() {
    return this.q
  }

  toJSON() {
    let returnOptions = this.q.return
    const q = Object.assign({}, this.q, {
      return: returnOptions
    })
    return JSON.parse(JSON.stringify(q))
  }
}

module.exports = QueryBuilder
