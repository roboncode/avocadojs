const MockCursor = require('./MockCursor')

class MockDatabaseCollection {
  exists() {
    return true
  }
}

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

  collection() {
    return new MockDatabaseCollection()
  }

  close() {

  }
}

module.exports = MockDatabase