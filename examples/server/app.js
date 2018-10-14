require('app-module-path').addPath(__dirname)
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
const orango = require('orango')
const cors = require('cors')
const app = express()
const readFiles = require('./helpers/readFiles')
const config = require('./config')
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
  await orango.connect('sample')

  // app.use(
  //   jwt({ secret: config.JWT_SECRET }).unless({ path: ['/login', '/id_token'] })
  // )

  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Invalid token2')
    }
  })

  app.use(cors())

  // // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // // parse application/json
  app.use(bodyParser.json())

  readFiles('controllers')

  app.listen(3000, () => console.log('Example app listening on port 3000!'))
}

module.exports = app

main()
