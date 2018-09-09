const { EventDispatcher } = require('tangjs')
const { asyncForEach, definePrivateProperty } = require('tangjs/lib/helpers')
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

  async connect(name = '_system', url = 'http://localhost:8529') {
    if (this.connection.connected) {
      if (this.connection.name === name && this.connection.url === url) {
        return Promise.resolve(this.connection)
      } else {
        throw new Error(
          'You must disconnect from ' +
            url +
            '/' +
            name +
            ' before connecting to another database'
        )
      }
    }
    await this.connection.connect(
      name,
      url
    )

    await asyncForEach(this.models, async model => {
      model.setOrango(this)
      if (model.schema.options.edge) {
        await this.createEdgeCollection(model.collectionName)
      } else {
        await this.createCollection(
          model.collectionName,
          model.schema.options.indexes
        )
      }
    })

    return this.connection
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

  uid() {
    return createUniqueId()
  }

  Schema(jsonSchema, options = {}) {
    return new Schema(jsonSchema, options)
  }

  EdgeSchema(from, to) {
    return new EdgeSchema(from, to)
  }

  async queryMany(query) {
    this._checkConnected()

    let cursor = await this.connection.db.query(query)
    return await cursor.all()
  }

  async queryOne(query) {
    this._checkConnected()

    let cursor = await this.connection.db.query(query)
    return cursor.all()
  }

  model(name, schema, collectionName = '') {
    let promise
    let model = this.models[name]

    if (schema) {
      if (model) {
        throw new Error(`A model with the "${name}" already exists`)
      }

      model = factory(name, schema, collectionName)
      model.setOrango(this)

      if (this.connection.connected) {
        if (model.schema.options.edge) {
          promise = this.createEdgeCollection(model.collectionName)
        } else {
          promise = this.createCollection(
            model.collectionName,
            model.schema.options.indexes
          )
        }
        definePrivateProperty(
          model,
          'ready',
          new Promise(resolve => {
            promise.then(() => {
              return resolve(model)
            })
          })
        )
      }
      this.models[name] = model
    }

    if (!model) {
      throw new Error(CONSTS.ERRORS.MODEL_NOT_FOUND + name)
    }
    return model
  }

  async createCollection(name, indexes) {
    this._checkConnected()

    let conn = this.connection
    let collection = await conn.db.collection(name)

    if (!(await collection.exists())) {
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

    if (!(await collection.exists())) {
      await collection.create()
    }

    return collection
  }

  async ensureIndexes(collectionName, indexes = []) {
    this._checkConnected()

    let conn = this.connection
    let collection = await conn.db.collection(collectionName)
    if (!(await collection.exists())) {
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
}

module.exports = Orango
