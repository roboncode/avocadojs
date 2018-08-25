const orango = require('../../lib/Orango').getInstance()
const Builder = require('../../tang/Builder')

async function importCategories(conn) {
  const Model = orango.model('Category')

  let items = require('./data/categories')
  items = orango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject({ noDefaults: true })
    .exec()

  await Model.importMany(docs, true)
}

async function importUsers() {
  const Model = orango.model('User')

  let items = require('./data/users')
  items = orango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject({ noDefaults: true })
    .exec()

  await Model.importMany(docs, true)
}

async function importFriends() {
  const Model = orango.model('Friend')

  let items = require('./data/friends')
  items = orango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject({ noDefaults: true })
    .exec()

  await Model.importMany(docs, true)
}

async function importDevices() {
  const Model = orango.model('Device')

  let items = require('./data/devices')
  items = orango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject({ noDefaults: true })
    .exec()

  await Model.importMany(docs, true)
}

async function importPosts() {
  const Model = orango.model('Post')

  let items = require('./data/posts')
  items = orango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject({ noDefaults: true })
    .exec()

  await Model.importMany(docs, true)
}

async function importLikes() {
  const Model = orango.model('Like')

  let items = require('./data/likes')
  items = orango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject({ noDefaults: true })
    .exec()

  await Model.importMany(docs, true)
}

async function importAllDocs() {
  await importCategories()
  await importUsers()
  await importFriends()
  await importDevices()
  await importPosts()
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
