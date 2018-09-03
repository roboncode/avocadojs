module.exports = function() {
  return {
    files: ['lib/**/*.js'],

    tests: ['test/**/*spec.js'],

    env: {
      type: 'node'
    }
  }
}
