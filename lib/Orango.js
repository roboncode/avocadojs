const { EventDispatcher } = require('tangjs')
const { definePrivateProperty } = require('tangjs/lib/helpers')
const { Builder } = require('tangjs/lib')
const Connection = require('./Connection')
const Schema = require('./Schema')
const EdgeSchema = require('./EdgeSchema')
const factory = require('./factory')
const helpers = require('./helpers')
const createUniqueId = require('./helpers/createUniqueId')
const CONSTS = require('./consts')

class Orango {
  static get(name = 'default') {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[name]) {
      this._instances[name] = new Orango(name)
    }
    return this._instances[name]
  }

  constructor(name = 'default') {
    this.Types = Schema.Types
    this.models = []
    definePrivateProperty(this, '$instanceName', name)
    this.events = EventDispatcher.getInstance(name)
    this.connection = Connection.getInstance(name)
    this.helpers = helpers
  }

  get(name = 'default') {
    return Orango.get(name)
  }

  builder(name = 'default') {
    return Builder.getInstance(name)
  }

  connect(name = '_system', url = 'http://localhost:8529') {
    return this.connection.connect(
      name,
      url
    )
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.disconnect()
    }
  }

  async dropDatabase(dropDatabase) {
    // TODO: Check if currently logged into _system
    if (this.connection && this.connection.connected) {
      this.connection.db.dropDatabase(dropDatabase)
    }
  }

  async importDocs(Model, items = [], options = {}) {
    if (typeof Model === 'string') {
      Model = this.model(Model)
    }
    let docs = await this.builder()
      .data(items)
      .convertTo(Model)
      .toObject({ noDefaults: !options.withDefaults })
      .build()

    return await Model.importMany(docs, options.truncate)
  }

  _checkConnected() {
    if (!this.connection.connected) {
      throw new Error(CONSTS.ERRORS.NOT_CONNECTED)
    }
  }

  async _connectionHandler(model) {
    if (model.schema.isEdge) {
      await this.createEdgeCollection(model.collectionName)
    } else {
      await this.createCollection(
        model.collectionName,
        model.schema.options.indexes
      )
    }
    this.events.emit(CONSTS.MODEL_READY, model)
  }

  uid() {
    return createUniqueId()
  }

  Schema(jsonSchema, options = {}) {
    return new Schema(jsonSchema, options)
  }

  EdgeSchema(from, to) {
    return new EdgeSchema(from, to)
  }

  model(name, schema, collectionName = '') {
    let model = this.models[name]

    if (schema) {
      if (model) {
        throw new Error(`A model with the "${name}" already exists`)
      }

      model = factory(name, this, schema, collectionName)
      this.models[name] = model
    }

    if (!model) {
      throw new Error(CONSTS.ERRORS.MODEL_NOT_FOUND + name)
    }

    // if we are connected to database
    if (this.connection.connected) {
      // this is used to check if a return promise is expected
      let isWaiting = false
      // this is used if they are waiting for a connection
      model.then = async resolve => {
        isWaiting = true
        // must delete then() to prevent recursive loop
        delete model.then
        // wait for connection
        await this._connectionHandler(model)
        // resolve promise
        resolve(model)
      }

      setImmediate(async () => {
        if (!isWaiting) {
          // must delete then() to prevent recursive loop
          delete model.then
          // wait for connection
          await this._connectionHandler(model)
        }
      })
    } else {
      this.connection.events.on('connected', () => {
        this._connectionHandler(model)
      })

      // this is used if they are waiting for a connection
      model.then = async resolve => {
        // must delete then() to prevent recursive loop
        delete model.then
        // wait for connection
        await this._connectionHandler(model)
        // resolve promise
        resolve(model)
      }
    }

    return model
  }

  async createCollection(name, indexes) {
    this._checkConnected()

    let conn = this.connection
    let collection = await conn.db.collection(name)
    let exists = await collection.exists()
    if (!exists) {
      await collection.create()
    }

    if (indexes) {
      await this.ensureIndexes(name, indexes)
    }

    return collection
  }

  async createEdgeCollection(name) {
    this._checkConnected()

    let conn = this.connection
    let collection = await conn.db.edgeCollection(name)
    let exists = await collection.exists()
    if (!exists) {
      await collection.create()
    }

    return collection
  }

  async ensureIndexes(collectionName, indexes = []) {
    this._checkConnected()

    let conn = this.connection
    let collection = await conn.db.collection(collectionName)
    let exists = await collection.exists()
    if (!exists) {
      throw new Error(CONSTS.ERRORS.COLLECTION_NOT_FOUND + collectionName)
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

  async rawQuery(statement) {
    this._checkConnected()
    let cursor = await this.connection.db.query(statement)
    return await cursor.all()
  }
}

module.exports = Orango
