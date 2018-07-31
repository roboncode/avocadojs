const Database = require('arangojs').Database
const EventDispatcher = require('../avocado/EventDispatcher')
const definePrivateProperty = require('../avocado/helpers/definePrivateProperty')


class Connection {
  static getInstance(name = 'default') {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[name]) {
      this._instances[name] = new this
      definePrivateProperty(this._instances[name], '$instanceName', name)
    }
    return this._instances[name]
  }

  constructor() {
    this.connected = false
  }

  async connect({ url = 'http://localhost:8529', name = '_system' }) {
    this.db = new Database(url)
    this.url = url
    this.name = name
    try {
      await db.createDatabase(name)
    } catch (e) {}
    await this.db.useDatabase(name)
    this.connected = true
    EventDispatcher.getInstance(this.$instanceName).emit('connected')
    return this
  }

  async disconnect() {
    if (this.connected) {
      this.db.close()
      this.connected = false
    }
  }
}

module.exports = Connection
