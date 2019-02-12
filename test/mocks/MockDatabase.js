const MockCursor = require('./MockCursor')
class MockDatabase {
  constructor(url) {
    this.url = url
  }

  useDatabase(name) {
    return new Promise(resolve => {
      resolve()
    })
  }

  login(username, password) {
    throw new Error('Invalid username or password')
  }

  async query() {
    return new MockCursor()
  }

  close() {

  }
}

module.exports = MockDatabase