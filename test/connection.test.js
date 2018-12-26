const MockDatabase = require('./mocks/MockDatabase')
const Connection = require('../lib/Connection')
const EVENTS = require('../lib/consts/events')

test('connect to database', async done => {
  let connection = new Connection(MockDatabase)
  connection.on(EVENTS.CONNECTED, conn => {
    expect(conn.connected).toBe(true)
    done()
  })
  await connection.connect()
})

test('connect to the same database', async () => {
  let connection = new Connection(MockDatabase)
  await connection.connect()
  await connection.connect()
  expect(connection.connected).toBe(true)
})

test('connect to database with username/password', async () => {
  let connection = new Connection(MockDatabase)
  try {
    await connection.connect(
      'foo',
      { password: 'bar' }
    )
  } catch (e) {
    expect(e.message).toBe('Invalid username or password')
  }
})

test('disconnect to database', async done => {
  let connection = new Connection(MockDatabase)
  connection.on(EVENTS.DISCONNECTED, conn => {
    expect(conn.connected).toBe(false)
    done()
  })
  await connection.connect()
  await connection.disconnect()
})
