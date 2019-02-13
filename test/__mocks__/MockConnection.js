const Connection = require('../../lib/Connection')
const MockDatabase = require('./MockDatabase')

class MockConnection extends Connection {
  constructor() {
    super()
    this.connected = false
  }

  async connect() {
    this.db = new MockDatabase()
    this.connected = true
    return this
  }
}

module.exports = MockConnection