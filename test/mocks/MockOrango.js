const Orango = require('../../lib/Orango')
// const Connection = require('../../lib/Connection')
const MockConnection = require('./MockConnection')
const { DEFAULTS } = require('../../lib/consts')

class MockOrango extends Orango {

  static get(database = DEFAULTS.DATABASE) {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[database]) {
      this._instances[database] = new MockOrango(database)
    }
    return this._instances[database]
  }

  constructor(name = DEFAULTS.DATABASE) {
    super()
    this.connection = new MockConnection()
    this.connect()
  }

  model(name, schema, collectionName) {
    let model = super.model(name, schema, collectionName)
    if(schema) {
      model.init(this)
    }
    return model
  }
}

module.exports = MockOrango