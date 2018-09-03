require('coveralls')
let http = require('http')
let Orango = require('../lib/Orango')

function checkConnection() {
  var req = http.request('http://localhost:8529', function(res) {
    res.on('data', function(chunk) {})

    res.on('end', function() {
      setTimeout(run, 5000)
    })
  })

  req.on('error', function() {
    setTimeout(checkConnection, 1000)
  })

  req.end()
}

after(async function() {
  try {
    await Orango.get('cleanup').connect()
    await Orango.get('cleanup').dropDatabase('test')
  } catch(e) {
    console.log('Ooops!', e.message)
  }
})

checkConnection()
