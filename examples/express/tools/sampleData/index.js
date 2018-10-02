const orango = require('orango')
const { objectToArray } = orango.helpers

async function importCategories() {
  const Model = orango.model('Category')

  let items = require('./data/categories')
  items = objectToArray(items)

  await orango.importDocs(Model, items, { truncate: true })
}

async function importDevices() {
  const Model = orango.model('Device')

  let items = require('./data/devices')
  items = objectToArray(items)

  await orango.importDocs(Model, items, { truncate: true })
}

async function importUsers() {
  const Model = orango.model('User')

  let items = require('./data/users')
  items = objectToArray(items)

  await orango.importDocs(Model, items, { truncate: true })
}

async function importFriends() {
  const Model = orango.model('Friend')

  let items = require('./data/friends')
  items = objectToArray(items)

  await orango.importDocs(Model, items, { truncate: true })
}

async function importPosts() {
  const Model = orango.model('Post')

  let items = require('./data/posts')
  items = objectToArray(items)

  await orango.importDocs(Model, items, { truncate: true })
}

async function importLikes() {
  const Model = orango.model('Like')

  let items = require('./data/likes')
  items = objectToArray(items)

  await orango.importDocs(Model, items, { truncate: true })
}

async function importAllDocs() {
  // await importCategories()
  // await importDevices()
  // await importFriends()
  // await importLikes()
  await importPosts()
  // await importUsers()
}

module.exports = {
  importAllDocs,
  importCategories,
  importDevices,
  importFriends,
  importLikes,
  importPosts,
  importUsers
}
