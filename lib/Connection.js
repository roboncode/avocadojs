const EventEmitter = require('events')
const Database = require('arangojs').Database
const { EventDispatcher } = require('tangjs')
const { definePrivateProperty } = require('tangjs/lib/helpers')
const { DEFAULTS, ERRORS, EVENTS } = require('./consts')
require('colors')

class Connection extends EventEmitter {
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
    super()
    this.connected = false
    this.events = new EventEmitter()
  }

  connect(
    name = DEFAULTS.DATABASE,
    {
      url = DEFAULTS.URL,
      username = DEFAULTS.USERNAME,
      password = DEFAULTS.PASSWORD
    }
  ) {
    return new Promise(async (resolve, reject) => {
      if (this.connected) {
        return reject(new Error(ERRORS.ALREADY_CONNECTED))
      }

      this.db = new Database(url)
      this.url = url
      this.name = name
      this.username = username
      this.password = password

      await this.db.useDatabase(name)
      if (password) {
        try {
          await this.db.login(username, password)
        } catch (e) {
          return reject(e)
        }
      }
      this.connected = true
      resolve(this)

      this.emit(EVENTS.CONNECTED, this)
      setTimeout(() => {
        EventDispatcher.getInstance(this.$instanceName).emit(
          EVENTS.CONNECTED,
          this
        )
      })
    })
  }

  async disconnect() {
    if (this.connected) {
      this.db.close()
      this.connected = false
      EventDispatcher.getInstance(this.$instanceName).emit(
        EVENTS.DISCONNECTED,
        this
      )
      this.emit(EVENTS.DISCONNECTED, this)
    }
  }
}

module.exports = Connection
