module.exports = function () {
  return {
    files: [
      'avocado/**/*.js',
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