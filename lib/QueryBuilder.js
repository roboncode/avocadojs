class QueryBuilder {
  constructor(query = {}) {
    this.q = query
  }

  name(val) {
    this.q.name = val
    return this
  }

  byId(id) {
    this.where({
      _key: id + ''
    })
    this.one()
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

  limit(val = 10) {
    this.q.limit = val
    return this
  }

  one(val = true) {
    this.q.one = val
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
      this.q.queries.push({
        let: opts[0],
        query: opts[1].toJSON()
      })
    } else {
      this.q.queries.push({
        query: opts[0].toJSON()
      })
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
