require('app-module-path').addPath(__dirname)
const orango = require('orango')
const readFiles = require('helpers/readFiles')
const { importAllDocs } = require('tools/sampleData')
require('colors')

async function main() {
  readFiles('models')
  await orango.connect('sample')
  await importAllDocs()
  console.log('Imported sample data!'.green)
}

main()
