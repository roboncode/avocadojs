require('app-module-path').addPath(__dirname + '/../../')
const fs = require('fs')
const orango = require('orango')
const { objectToArray } = orango.helpers
const config = require('../../config')
const readFiles = require('../../helpers/readFiles')
require('colors')
// console.log('#console'.bgGreen, config.DB_ROOT_PASS)
// return
async function createDatabase() {
  await orango.connect(
    '_system',
    { username: config.DB_ROOT_USER, password: config.DB_ROOT_PASS }
  )
  await orango.dropDatabase(config.DB_NAME)
  await orango.createDatabase(config.DB_NAME, [
    {
      username: config.DB_ADMIN_USER,
      password: config.DB_ADMIN_PASS
    }
  ])

  await orango.disconnect()
}

async function importData(filename) {
  const modelName = filename.split('.js').join('')
  const Model = await orango.model(modelName)

  let items = require(__dirname + '/data/' + filename)
  items = objectToArray(items)

  console.log(
    'Importing'.green,
    filename.substr(0, filename.length - 3).cyan,
    'as',
    Model.collectionName.cyan
  )

  await orango.importDocs(Model, items, { truncate: true })
}

async function main() {
  await createDatabase()

  readFiles(__dirname + '/../../models')
  await orango.connect(
    config.DB_NAME,
    {
      username: config.DB_ADMIN_USER,
      password: config.DB_ADMIN_PASS
    }
  )

  let files = fs.readdirSync(__dirname + '/data')
  for (let i = 0; i < files.length; i++) {
    try {
      await importData(files[i])
    } catch (e) {
      console.log('#error importint', e.message)
    }
  }

  console.log('Imported sample data!'.green)
}

main()
