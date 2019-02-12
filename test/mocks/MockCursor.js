class MockCursor {
  async all() {
    return MockCursor.returnVal || []
  }

  async next() {
    return MockCursor.returnVal.shift()
  }
}

module.exports = MockCursor