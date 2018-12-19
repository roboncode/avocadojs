const NodeEnvironment = require('jest-environment-node');
let orango = require('../lib')

module.exports = class OrangoEnvironment extends NodeEnvironment {
    constructor(config) {
      super(config);
    }
  
    async setup() {
      super.setup();
      await orango.connect('test')
      this.global.__ORANGO__ =  orango
    }
  
    async teardown() {
      await super.teardown();
      await orango.disconnect()
    }
  
    runScript(script) {
      return super.runScript(script);
    }
  };