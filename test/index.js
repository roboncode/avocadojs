require('coveralls')

let http = require('http')
let orango = require('../lib')
let Orango = require('../lib/Orango')

async function connectToDefaultDb() {
  try {
    // connect to test db
    await orango.connect('test')
    // connect to system db
    await Orango.get('system').connect()
    // this db is used for the purpose of disconnecting test
    await Orango.get('disconnect').connect()

    // create Test model
    await orango.model('Test', {
      name: {
        type: String,
        default: 'test'
      },
      comments: [{ $id: String, text: String }],
      tags: [String]
    }).ready

    // run tests
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
    await Orango.get('system').dropDatabase('disconnect')
  } catch (e) {
    console.log('Ooops!', e.message)
  }
})

checkConnection()
