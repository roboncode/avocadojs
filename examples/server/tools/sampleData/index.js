require('app-module-path').addPath(__dirname + '/../../')
const fs = require('fs')
const orango = require('orango')
const { objectToArray } = orango.helpers
const readFiles = require('../../helpers/readFiles')
require('colors')

async function createDatabase() {
  await orango.connect('_system')
  await orango.dropDatabase('sample')
  await orango.createDatabase('sample', [
    {
      username: 'admin',
      password: 'admin'
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
  await orango.connect('sample')

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
