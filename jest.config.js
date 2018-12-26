module.exports = {
  testRegex: './test/.*.test.js$',
  // globalSetup: './test/setup.js',
  // globalTeardown: './test/teardown.js',
  // testEnvironment: './test/environment.js',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10
    }
  }
}
