module.exports = function () {
  return {
    files: [
      'avocado/**/*.js'
    ],

    tests: [
      'test/**/*spec.js'
    ],

    env: {
      type: 'node'
    }
  };
};