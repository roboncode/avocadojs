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

  async hasNext() {
    return this.cIndex > 0
  }
}

module.exports = MockCursor