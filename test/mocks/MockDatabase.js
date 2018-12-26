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

  query() {
    return new Promise(resolve => {
      resolve()
    })
  }

  close() {

  }
}

module.exports = MockDatabase