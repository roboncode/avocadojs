const EventEmitter = require('events')


class EventDispatcher {
  static getInstance(name = 'default') {
    if (!this.eventEmitters) {
      this.eventEmitters = {}
    }
    if (!this.eventEmitters[name]) {
      this.eventEmitters[name] = new EventEmitter()
    }
    return this.eventEmitters[name]
  }
}

module.exports = EventDispatcher
