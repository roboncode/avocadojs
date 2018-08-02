const Connection = require('./Connection')
const Schema = require('./Schema')
const EventDispatcher = require('../avocado/EventDispatcher')
const asyncForEach = require('../avocado/helpers/asyncForEach')
const factory = require('./factory')
const definePrivateProperty = require('../avocado/helpers/definePrivateProperty')
const CONSTS = require('./consts')

class Arango {
  static getInstance(name = 'default') {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[name]) {
      this._instances[name] = new this(name)
    }
    return this._instances[name]
  }

  constructor(name = 'default') {
    this.models = []
    definePrivateProperty(this, '$instanceName', name)
    this.events = EventDispatcher.getInstance(name)
    this.connection = Connection.getInstance(name)
  }

  async connect(url, db) {
    await this.connection.connect(
      url,
      db
    )
    asyncForEach(this.models, async (model, name) => {
      model.setConnection(this.connection)
      let options = model.options
      let collectionName = model.getCollectionName()

      await this.createCollection(collectionName, options.indexes)
    })

    return this.connection
  }

  getConnection() {
    return this.connection
  }

  Schema(jsonSchema, options = {}) {
    return new Schema(jsonSchema, options)
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

  checkConnected() {
    if (!this.connection.connected) {
      throw new Error(CONSTS.ERRORS.NOT_CONNECTED)
    }
  }

  async importDocs(conn, ModelClass, docs, options = {}) {
    // User.importDocs(toArray(users), true)
  }

  model(name, schema, options = {}) {
    let model = this.models[name]
    if (schema) {
      model = factory(name, schema, options)
      model.setConnection(this.connection)

      if(this.connection.connected) {
        let options = model.options
        let collectionName = model.getCollectionName()

        this.createCollection(collectionName, options.indexes)
      }

      this.models[name] = model
    }
    
    if (!model) {
      throw new Error(CONSTS.ERRORS.MODEL_NOT_FOUND + name)
    }
    return model
  }

  async createCollection(name, indexes, truncate = false) {
    this.checkConnected()
    
    let conn = this.connection
    let collection = await conn.db.collection(name)
    
    if (await collection.exists()) {
      if (truncate) {
        await collection.drop()
        await collection.create()
      }
    } else {
      await collection.create()
    }

    if(indexes) {
      await this.ensureIndexes(name, indexes)
    }

    return collection
  }

  async ensureIndexes(collectionName, indexes = []) {
    this.checkConnected()

    let conn = this.connection
    let collection = await conn.db.collection(collectionName)
    if (!await collection.exists()) {
      throw new Error(CONSTS.ERRORS.COLLECTION_NOT_FOUND +  collectionName)
    }
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