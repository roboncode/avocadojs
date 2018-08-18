const arango = require('../../arango/Arango').getInstance()
const Builder = require('../../avocado/Builder')

async function importCategories(conn) {
  const Model = arango.model('Category')

  let items = require('./data/categories')
  items = arango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject()
    .exec()

  await Model.importMany(docs, true)
}

async function importUsers() {
  const Model = arango.model('User')

  let items = require('./data/users')
  items = arango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject()
    .exec()

  await Model.importMany(docs, true)
}

async function importFriends() {
  const Model = arango.model('Friend')

  let items = require('./data/friends')
  items = arango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject()
    .exec()

  await Model.importMany(docs, true)
}

async function importDevices() {
  const Model = arango.model('Device')

  let items = require('./data/devices')
  items = arango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject()
    .exec()

  await Model.importMany(docs, true)
}

async function importPosts() {
  const Model = arango.model('Post')

  let items = require('./data/posts')
  items = arango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject()
    .exec()

  await Model.importMany(docs, true)
}

async function importLikes() {
  const Model = arango.model('Like')

  let items = require('./data/likes')
  items = arango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject()
    .exec()

  await Model.importMany(docs, true)
}

async function importAllDocs() {
  // await importCategories()
  // await importUsers()
  // await importFriends()
  // await importDevices()
  // await importPosts()
  await importLikes()
}

module.exports = {
  importAllDocs,
  importCategories,
  importUsers,
  importFriends,
  importDevices,
  importPosts,
  importLikes
}
