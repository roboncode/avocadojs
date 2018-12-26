const EventEmitter = require('events')
const { EventDispatcher } = require('tangjs')
const { DEFAULTS, ERRORS, EVENTS } = require('./consts')
require('colors')

class Connection extends EventEmitter {
  constructor(Database) {
    super()
    this.connected = false
    this.events = new EventEmitter()
    this.Database = Database
  }

  connect(name = DEFAULTS.DATABASE, options = {}) {
    this.name = name
    this.url = options.url || DEFAULTS.URL
    this.username = options.username || DEFAULTS.USERNAME
    this.password = options.password || DEFAULTS.PASSWORD

    return new Promise(async (resolve, reject) => {
      if (this.connected) {
        return resolve(this)
      }

      this.db = new this.Database(this.url)

      await this.db.useDatabase(name)
      if (this.password) {
        try {
          await this.db.login(this.username, this.password)
        } catch (e) {
          return reject(e)
        }
      }
      this.connected = true
      resolve(this)

      this.emit(EVENTS.CONNECTED, this)
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
