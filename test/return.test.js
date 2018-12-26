const Return = require('../lib/Return')

test('return should set value to tue', () => {
  let r = new Return().value()
  let json = r.toJSON()
  expect(json.value).toBe(true)
})

test('return should append target as declared variable', () => {
  let r = new Return().append('foo', 'bar')
  let json = r.toJSON()
  let item = json.actions.pop()
  expect(item.action).toBe('append')
  expect(item.target).toBe('foo')
  expect(item.as).toBe('bar')
})

test('return should merge target', () => {
  let r = new Return().merge('foo')
  let json = r.toJSON()
  let item = json.actions[0]
  expect(json.actions.length).toBe(1)
  expect(item.action).toBe('merge')
  expect(item.target).toBe('foo')
})

test('return should assign one', () => {
  let r = new Return().one()
  let json = r.toJSON()
  expect(json.one).toBe(true)
})
