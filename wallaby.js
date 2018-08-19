module.exports = function () {
  return {
    files: [
      'avocado/**/*.js',
      'arango/**/*.js',
    ],

    tests: [
      'test/**/*spec.js'
    ],

    env: {
      type: 'node'
    }
  };
};