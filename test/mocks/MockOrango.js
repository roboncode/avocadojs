const MockDatabase = require('./MockDatabase')
const Connection = require('../../lib/Connection')

class MockOrango {
  constructor(name = '_system') {
    this.name = name
    // this.Types = Schema.Types
    // this.models = {}
    // this.collectionsCreated = []
    // this.pendingModels = []
    // definePrivateProperty(this, '$instanceName', name)
    // this.events = EventDispatcher.getInstance(name)
    this.connection = new Connection(MockDatabase)
    // this.helpers = helpers
    // this.consts = consts
    // this.Model = Model
    // this.logger = logger
  }

  model(name, ClassRef, collectionName) {
    ClassRef.orango = this
  }
}

module.exports = MockOrango