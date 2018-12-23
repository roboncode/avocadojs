module.exports = orango => {
  class Settings extends orango.Model {
    constructor(data) {
      super(data)
      this.online = false
    }
  }

  Settings.struct = {
    locale: 'Locale'
  }

  return orango.model('Settings', Settings, false)
}

