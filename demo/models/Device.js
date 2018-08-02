const arango = require('../../arango')

let schema = arango.Schema({
  token: String,
  provider: String, // firebase, onesignal
  platform: { type: String, valid: ['android', 'ios', 'browser'] },
  os: String, // mac, windows, linux
  browser: String,
  device: String // safari, chrome, MAC id on device etc
})

module.exports = arango.model('Device', schema)
