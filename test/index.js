require('coveralls')

let http = require('http')
let orango = require('../lib')
let Orango = require('../lib/Orango')

async function connectToDefaultDb() {
  try {
    await orango.connect('test')
    await Orango.get('system').connect()
    run()
  } catch (e) {
    setTimeout(connectToDefaultDb, 1000)
  }
}

function checkConnection() {
  const req = http.request('http://localhost:8529', function(res) {
    res.on('data', function(chunk) {})

    res.on('end', function() {
      connectToDefaultDb()
    })
  })

  req.on('error', function() {
    setTimeout(checkConnection, 1000)
  })

  req.end()
}

after(async function() {
  try {
    await Orango.get('system').dropDatabase('test')
  } catch (e) {
    console.log('Ooops!', e.message)
  }
})

checkConnection()
