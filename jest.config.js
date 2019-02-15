module.exports = {
  testRegex: './test/.*.test.js$',
  // globalSetup: './test/setup.js',
  // globalTeardown: './test/teardown.js',
  // testEnvironment: './test/environment.js',
  // setupFiles: ['./test/helpers.js'],
  // coveragePathIgnorePatterns: ["/models/"],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 0
    }
  },
}
