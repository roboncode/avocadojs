require('coveralls')

let http = require('http')
let orango = require('../lib')
require('colors')

async function connectToDefaultDb() {
  // connect to default database
  await orango.connect()
  // create databases
  await orango.createDatabase('test')
  await orango.createDatabase('model_tests')
  await orango.createDatabase('disconnect')
  await orango.createDatabase('custom')
  await orango.createDatabase('edge')
  // disconnect from default database
  await orango.disconnect()
  // connect to test db
  await orango.connect('test')
  // connect to system db
  await orango.get('system').connect()
  // this db is used for the purpose of disconnecting test
  await orango.get('disconnect').connect()

  // create Test model
  await orango.model('Test', {
    name: {
      type: String,
      default: 'test'
    },
    comments: [{ $id: String, text: String }],
    tags: [String]
  })
  // run tests
  run()
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
  // let dbs = await orango.connection.db.listDatabases()

  // if (dbs.indexOf('test') !== -1) {
  //   await orango.get('system').dropDatabase('test')
  // }

  // if (dbs.indexOf('model_tests') !== -1) {
  //   await orango.get('system').dropDatabase('model_tests')
  // }

  // if (dbs.indexOf('disconnect') !== -1) {
  //   await orango.get('system').dropDatabase('disconnect')
  // }

  // if (dbs.indexOf('custom') !== -1) {
  //   await orango.get('system').dropDatabase('custom')
  // }

  // if (dbs.indexOf('edge') !== -1) {
  //   await orango.get('system').dropDatabase('edge')
  // }
})

checkConnection()
