require('app-module-path').addPath(__dirname)
const fs = require('fs')
const readFiles = require('./helpers/readFiles')
const orango = require('orango')
require('colors')

let query = JSON.parse(fs.readFileSync(__dirname + '/query.json', {
  encoding: 'utf-8'
}))

async function execQuery(query) {
  // let queryToAQL = orango.helpers.queryToAQL(orango)
  // let result = await queryToAQL.generate(query)
  let result = await orango.queryToAQL(query, true)
  console.log(result.green)
}

async function main() {
  readFiles(__dirname + '/models')
  await execQuery(query)
}

main()
