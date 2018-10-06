require('app-module-path').addPath(__dirname)
const orango = require('orango')
const readFiles = require('helpers/readFiles')
const {
  importAllDocs
} = require('tools/sampleData')
require('colors')

async function main() {
  await orango.connect('_system', {
    password: 'orangorocks'
  })
  await orango.dropDatabase('sample')
  await orango.createDatabase('sample', [
    {
      username: 'admin',
      password: 'admin'
    }
  ])
  await orango.disconnect()

  await orango.connect('sample', {
    username: 'admin',
    password: 'admin'
  })

  readFiles('models')
  
  await importAllDocs()
  console.log('Imported sample data!'.green)
}

main()