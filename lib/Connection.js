const EventEmitter = require('events')
const Database = require('arangojs').Database
const { EventDispatcher } = require('tangjs')
const { definePrivateProperty } = require('tangjs/lib/helpers')
const CONSTS = require('./consts')
require('colors')

class Connection {
  static getInstance(name = 'default') {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[name]) {
      this._instances[name] = new this()
      definePrivateProperty(this._instances[name], '$instanceName', name)
    }
    return this._instances[name]
  }

  constructor() {
    this.connected = false
    this.events = new EventEmitter()
  }

  connect(name = '_system', url = 'http://localhost:8529') {
    return new Promise(async (resolve, reject) => {
      if (this.connected) {
        return reject(new Error(CONSTS.ERRORS.ALREADY_CONNECTED))
      }
      this.db = new Database(url)
      const names = await this.db.listDatabases()
      this.url = url
      this.name = name
      if (names.indexOf(name) === -1) {
        await this.db.createDatabase(name)
      }
      await this.db.useDatabase(name)
      this.connected = true
      resolve(this)

      this.events.emit('connected', this)
      EventDispatcher.getInstance(this.$instanceName).emit('connected', this)
    })
  }

  async disconnect() {
    if (this.connected) {
      this.db.close()
      this.connected = false
      EventDispatcher.getInstance(this.$instanceName).emit('disconnected', this)
      this.events.emit('disconnected', this)
    }
  }
}

module.exports = Connection
