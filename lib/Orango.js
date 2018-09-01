const Connection = require('./Connection')
const Schema = require('./Schema')
const EventDispatcher = require('../tang/EventDispatcher')
const asyncForEach = require('../tang/helpers/asyncForEach')
const factory = require('./factory')
const definePrivateProperty = require('../tang/helpers/definePrivateProperty')
const createUniqueId = require('./helpers/createUniqueId')
const CONSTS = require('./consts')

class Orango {
  static get(name = 'default') {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[name]) {
      this._instances[name] = new this(name)
    }
    return this._instances[name]
  }

  constructor(name = 'default') {
    this.Types = Schema.Types
    this.models = []
    definePrivateProperty(this, '$instanceName', name)
    this.events = EventDispatcher.getInstance(name)
    this.connection = Connection.getInstance(name)
  }

  async connect(name = '_system', url = 'http://localhost:8529') {
    await this.connection.connect(
      name,
      url
    )

    await asyncForEach(this.models, async model => {
      model.setConnection(this.connection)
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

  model(name, schema, collectionName = '') {
    let model = this.models[name]
    if (schema) {
      model = factory(name, schema, collectionName)
      model.setConnection(this.connection)

      if (this.connection.connected) {
        if (model.schema.options.edge) {
          this.createEdgeCollection(model.collectionName)
        } else {
          this.createCollection(model.collectionName, model.schema.options.indexes)
        }
      }

      this.models[name] = model
    }

    if (!model) {
      throw new Error(CONSTS.ERRORS.MODEL_NOT_FOUND + name)
    }
    return model
  }

  async createCollection(name, indexes, truncate = false) {
    this._checkConnected()

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

    if (indexes) {
      await this.ensureIndexes(name, indexes)
    }

    return collection
  }

  async createEdgeCollection(name, truncate = false) {
    this.checkConnected()

    let conn = this.connection
    let collection = await conn.db.edgeCollection(name)

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
