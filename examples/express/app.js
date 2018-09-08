require('app-module-path').addPath(__dirname)
const express = require('express')
const orango = require('orango')
const cors = require('cors')
const app = express()
const readFiles = require('helpers/readFiles')
require('colors')

// listen for connection to ArangoDB
orango.events.on('connected', () => {
  console.log(
    'Connected to ArangoDB:'.green,
    orango.connection.url + '/' + orango.connection.name
  )
  readFiles('controllers')
})

async function main() {
  // define models
  readFiles('models')

  // connect to ArangoDB
  await orango.connect('sample')

  app.use(cors())

  app.listen(3000, () => console.log('Example app listening on port 3000!'))
}

app.orango = orango
module.exports = app

main()
