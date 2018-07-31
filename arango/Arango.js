const Connection = require('./Connection')
const Schema = require('./Schema')
const EventDispatcher = require('../avocado/EventDispatcher')
const factory = require('./factory')
const definePrivateProperty = require('../avocado/helpers/definePrivateProperty')


class Arango {
  static getInstance(name = 'default') {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[name]) {
      this._instances[name] = new this()
      definePrivateProperty(this._instances[name], '$instanceName', name)
    }
    return this._instances[name]
  }

  constructor() {
    this.models = []
    definePrivateProperty(this, '$instanceName', 'default')
  }

  async connect(url, db) {
    this.events = EventDispatcher.getInstance(this.$instanceName)
    this.connection = Connection.getInstance(this.$instanceName)
    await this.connection.connect(
      url,
      db
    )
    for (let name in this.models) {
      this.models[name].setConnection(this.connection)
    }
    return this.connection
  }

  getConnection() {
    return this.connection
  }

  createSchema(jsonSchema) {
    return new Schema(jsonSchema)
  }

  addMethod(name, fn) {}

  listMethods() {}

  toArray(data) {
    if (data instanceof Array) {
      return data
    }
    let list = []
    for (let e in data) {
      if (data.hasOwnProperty(e)) {
        let item = data[e]
        item._key = e
        list.push(item)
      }
    }
    return list
  }

  async initDatabase(conn, models, truncate = false) {
    for (let name in models) {
      if (models.hasOwnProperty(name)) {
        let options = models[name].options
        let collectionName = models[name].getCollectionName()
        await this.createCollection(conn.db, collectionName, truncate)
        await this.createIndexes(conn.db, collectionName, options.indexes)
      }
    }
  }

  async importDocs(conn, ModelClass, docs, options = {}) {
    // User.importDocs(toArray(users), true)
  }

  model(name, schema, options = {}) {
    if (schema) {
      this.models[name] = factory(name, schema, options)
      this.models[name].setConnection(this.connection)
    }
    if (!this.models[name]) {
      throw new Error('Model not found:' + name)
    }
    return this.models[name]
  }

  async createCollection(db, name, truncate = false) {
    let collection = await db.collection(name)
    if (await collection.exists()) {
      if (truncate) {
        await collection.drop()
        await collection.create()
      }
    } else {
      await collection.create()
    }
    return collection
  }

  async createIndexes(db, colName, indexes = []) {
    let collection = await this.createCollection(db, colName)
    for (let n = 0; n < indexes.length; n++) {
      let item = indexes[n]
      switch (item.type) {
        case 'hash':
          await collection.createHashIndex(item.fields, item.opts)
          break
        case 'skipList':
          await collection.createSkipList(item.fields, item.opts)
          break
      }
    }
  }
}

module.exports = Arango
