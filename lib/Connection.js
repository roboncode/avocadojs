const EventEmitter = require('events')
const { EventDispatcher } = require('tangjs')
const { DEFAULTS, EVENTS } = require('./consts')
const Database = require('arangojs').Database

class Connection extends EventEmitter {
  constructor() {
    super()
    this.connected = false
    this.events = new EventEmitter()
  }

  async connect(name = DEFAULTS.DATABASE, options = {}) {
    this.name = name
    this.url = options.url || DEFAULTS.URL
    this.username = options.username || DEFAULTS.USERNAME
    this.password = options.password || DEFAULTS.PASSWORD

    if (this.connected) {
      this.emit(EVENTS.CONNECTED, this)
      return this
    }

    this.db = new Database(options)
    this.db.useDatabase(name)

    try {
      if (
        this.username !== DEFAULTS.USERNAME ||
        this.password !== DEFAULTS.PASSWORD
      ) {
        await this.db.login(this.username, this.password)
      }
      this.connected = await this.db.exists()
      if (this.connected) {
        this.emit(EVENTS.CONNECTED, this)
        return this
      }
    } catch (e) {
      throw new Error('Invalid credentials or unauthorized to execute request')
    }
    throw new Error(`The database "${name}" does not exist`)
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
