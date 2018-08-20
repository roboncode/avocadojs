module.exports = function () {
  return {
    files: [
      'tang/**/*.js',
      'orango/**/*.js',
    ],

    tests: [
      'test/**/*spec.js'
    ],

    env: {
      type: 'node'
    }
  };
};