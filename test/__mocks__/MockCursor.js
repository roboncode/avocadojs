class MockCursor {

  constructor() {
    this.cIndex = 0
  }

  async all() {
    return MockCursor.returnVal || []
  }

  async next() {
    return MockCursor.returnVal[this.cIndex++]
  }
}

module.exports = MockCursor