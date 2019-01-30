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

  connect(name = DEFAULTS.DATABASE, options = {}) {
    this.name = name
    this.url = options.url || DEFAULTS.URL
    this.username = options.username || DEFAULTS.USERNAME
    this.password = options.password || DEFAULTS.PASSWORD

    return new Promise(async (resolve, reject) => {
      if (this.connected) {
        return resolve(this)
      }

      this.db = new Database(options)
      this.db.useDatabase(name)
      let exists = await this.db.exists()
      if (exists) {
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
      } else {
        reject(new Error(`The database "${name}" does not exist`))
      }
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
