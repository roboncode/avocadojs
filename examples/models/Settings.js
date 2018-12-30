module.exports = ({ orango }) => {
  class Settings extends orango.Model {
    constructor(data) {
      super(data, Settings.schema)
      this.online = false
    }
  }

  Settings.schema = {
    online: false,
    locale: String
  }

  Settings.struct = {
    locale: 'Locale'
  }

  // do not create a collection for model (false)
  return orango.model('Settings', Settings, false)
}

