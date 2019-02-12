const Connection = require('../../lib/Connection')
const MockDatabase = require('./MockDatabase')

class MockConnection extends Connection {
  constructor() {
    super()
  }

  async connect() {
    this.db = new MockDatabase()
    return this
  }
}

module.exports = MockConnection