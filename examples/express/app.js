require('app-module-path').addPath(__dirname)
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const orango = require('orango')
const app = express()
const readFiles = require('helpers/readFiles')
require('colors')

// listen for connection to ArangoDB
orango.events.on('connected', () => {
  console.log(
    'Connected to ArangoDB:'.green,
    orango.connection.url + '/' + orango.connection.name
  )
})

async function main() {
  // define models
  readFiles('models')

  // connect to ArangoDB
  await orango.connect('sample', {
    username: 'root',
    password: 'orangorocks'
  })

  app.use(cors())

  // // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: false
  }))

  // // parse application/json
  app.use(bodyParser.json())

  // import controllere
  readFiles('controllers')

  app.listen(3000, () => console.log('Example app listening on port 3000!'))
}

app.orango = orango
module.exports = app

main()