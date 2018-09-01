module.exports = function () {
  return {
    files: [
      'tang/**/*.js',
      'lib/**/*.js',
    ],

    tests: [
      'test/**/*spec.js'
    ],

    env: {
      type: 'node'
    }
  };
};