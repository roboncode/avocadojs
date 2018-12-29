module.exports = ({ orango }) => {
  class Settings extends orango.Model {
    constructor(data) {
      super(data)
      this.online = false
    }
  }

  Settings.struct = {
    locale: 'Locale'
  }

  // do not create a collection for model (false)
  return orango.model('Settings', Settings, false)
}

