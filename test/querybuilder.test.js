const QueryBuilder = require('../lib/QueryBuilder')

test('querybuilder should set name', () => {
  let qb = new QueryBuilder()
  qb.name('foo')
  let json = qb.toJSON()
  expect(json.name).toBe('foo')
})

test('querybuilder should set byId', () => {
  let qb = new QueryBuilder()
  qb.byId(1)
  let json = qb.toJSON()
  expect(json.where._key).toBe('1')
})

test('querybuilder should set where', () => {
  let qb = new QueryBuilder()
  qb.where({ foo: 'bar' })
  let json = qb.toJSON()
  expect(json.where.foo).toBe('bar')
})

test('querybuilder should set offset', () => {
  let qb = new QueryBuilder()
  qb.offset(1)
  let json = qb.toJSON()
  expect(json.offset).toBe(1)
})

test('querybuilder should set limit', () => {
  let qb = new QueryBuilder()
  qb.limit(1)
  let json = qb.toJSON()
  expect(json.limit).toBe(1)
})

test('querybuilder one should set limit and return as one', () => {
  let qb = new QueryBuilder()
  qb.one()
  let json = qb.toJSON()
  expect(json.limit).toBe(1)
  expect(json.return.one).toBe(true)
})

test('querybuilder should set defaults', () => {
  let qb = new QueryBuilder()
  qb.withDefaults()
  let json = qb.toJSON()
  expect(json.withDefaults).toBe(true)
})

test('querybuilder should set let', () => {
  let qb = new QueryBuilder()
  qb.let('foo', 'bar')
  let json = qb.toJSON()
  expect(json.lets.foo).toBe('bar')
})

test('querybuilder should set select', () => {
  let qb = new QueryBuilder()
  qb.select('foo')
  let json = qb.toJSON()
  expect(json.select).toBe('foo')
})

test('querybuilder should set select', () => {
  let qb = new QueryBuilder()
  qb.select('foo')
  qb.select('')
  let json = qb.toJSON()
  expect(json.select).toBeUndefined()
})

test('query should throw error witn invalid key/value', () => {
  let qb = new QueryBuilder()
  function query() {
    qb.query('foo', 'bar')
  }
  expect(query).toThrow('query must be an instance of QueryBuilder')
})

test('querybuilder should set query key/value', () => {
  let qb = new QueryBuilder()
  function query() {
    qb.query({ foo: 'bar' })
  }
  expect(query).toThrow('query must be an instance of QueryBuilder')
})

test('querybuilder should set query with key/value', () => {
  let qb = new QueryBuilder()
  let bar = new QueryBuilder()
  qb.query('foo', bar)
  let json = qb.toJSON()
  expect(json.queries.length).toBe(1)
  expect(json.queries[0].let).toBe('foo')
  expect(json.queries[0].query).toMatchObject({})
})

test('querybuilder should set query', () => {
  let qb = new QueryBuilder()
  let bar = new QueryBuilder()
  qb.query(bar)
  let json = qb.toJSON()
  expect(json.queries.length).toBe(1)
  expect(json.queries[0].query).toMatchObject({})
})

test('querybuilder should return query', () => {
  let qb = new QueryBuilder()
  expect(qb.getQuery()).toMatchObject({})
})
