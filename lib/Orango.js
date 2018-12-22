const { EventDispatcher } = require('tangjs')
const { definePrivateProperty } = require('tangjs/lib/helpers')
const { Builder } = require('tangjs/lib')
const EventEmitter = require('events')
const Connection = require('./Connection')
const Model = require('./Model')
const Schema = require('./Schema')
const Query = require('./models/Query')
const helpers = require('./helpers')
const createUniqueId = require('./helpers/createUniqueId')
const merge = require('lodash/merge')
const CONSTS = require('./consts')
const { ERRORS, EVENTS, METHODS } = CONSTS

class Orango extends EventEmitter {
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
    super()
    this.name = name
    this.Types = Schema.Types
    this.models = []
    this.collectionsCreated = []
    this.pendingModels = []
    definePrivateProperty(this, '$instanceName', name)
    this.events = EventDispatcher.getInstance(name)
    this.connection = Connection.getInstance(name)
    this.helpers = helpers
    this.CONSTS = CONSTS

    this.connection.once(EVENTS.CONNECTED, () => {
      for (let i = 0; i < this.pendingModels.length; i++) {
        this._createCollection(this.pendingModels[i])
      }
    })
  }
  
  get(name = 'default') {
    return Orango.get(name)
  }

  builder(name = 'default') {
    return Builder.getInstance(name)
  }

  connect(options = {}) {
    merge({ url: 'http://localhost:8529', username: 'root', password: '' }, options)
    return this.connection.connect(this.name, options)
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.disconnect()
    }
  }

  async createDatabase(name, users = []) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].hasOwnProperty('password')) {
        users[i].passwd = users[i].password
        delete users[i].password
      }
    }
    const db = this.connection.db
    const names = await db.listDatabases()
    if (names.indexOf(name) === -1) {
      await db.createDatabase(name, users)
    }
    this.emit(EVENTS.DATABASE_CREATED, name)
    EventDispatcher.getInstance(this.$instanceName).emit(EVENTS.DATABASE_CREATED, name)
  }

  async dropDatabase(name) {
    // TODO: Check if currently logged into _system
    if (this.connection && this.connection.connected) {
      const names = await this.connection.db.listDatabases()
      if (names.indexOf(name) !== -1) {
        this.connection.db.dropDatabase(name)
      }
      this.emit(EVENTS.DATABASE_DROPPED, name)
      EventDispatcher.getInstance(this.$instanceName).emit(EVENTS.DATABASE_DROPPED, name)
    }
  }

  // TODO: Move this to model
  async importDocs(Model, items = [], options = {}) {
    if (typeof Model === 'string') {
      Model = this.model(Model)
    }
    let docs = await this.builder()
      .data(items)
      .convertTo(Model)
      .toObject({
        noDefaults: !options.withDefaults
      })
      .build()

    return await Model.importMany(docs, options.truncate)
  }

  queryToAQL(query, formatted = false) {
    return helpers.queryToAQL(this).generate(query, formatted)
  }

  _checkConnected() {
    if (!this.connection.connected) {
      throw new Error(ERRORS.NOT_CONNECTED)
    }
  }

  async _createCollection(model) {
    if (this.collectionsCreated.indexOf(model.collectionName) === -1) {
      this.collectionsCreated.push(model.collectionName)
      if (model.schema.isEdge) {
        await this.createEdgeCollection(model.collectionName)
      } else {
        await this.createCollection(model.collectionName, model.schema.options.indexes)
      }
      model.emit(EVENTS.READY, model)
    }
  }

  uid() {
    return createUniqueId()
  }

  Schema(jsonSchema, options = {}) {
    return new Schema(jsonSchema, options)
  }

  model(name, schema, ...rest) {
    let model = this.models[name]
    // this is used to check if a return promise is expected
    let isWaiting = false

    if (schema) {
      if (model) {
        throw new Error(ERRORS.MODEL_EXISTS.split('{name}').join(name))
      }

      model = Model.factory(this, name, schema, ...rest)
      this.models[name] = model
    }

    if (!model) {
      let notFound = ERRORS.MODEL_NOT_FOUND.split('{name}').join(name)
      throw new Error(notFound)
    }

    // this is used if they are waiting for a connection
    model.then = async (resolve) => {
      isWaiting = true
      // must delete then() to prevent recursive loop
      delete model.then
      // wait for connection
      await this._createCollection(model)
      // resolve promise
      resolve(model)
    }

    setImmediate(async () => {
      if (!isWaiting) {

        // must delete then() to prevent recursive loop
        delete model.then

        if (this.connection.connected) {
          await this._createCollection(model)
        } else if(this.pendingModels.indexOf(model) === -1) {
          this.pendingModels.push(model)
        }
      }
    })

    return model
  }

  _onConnected() {
    if (!model.then) {
      this._createCollection(model)
    }
  }

  execQuery(query) {
    return new Promise(async (resolve, reject) => {
      // Validate query to make sure nothing is invalid
      let q = await this.builder()
        .data(query)
        .convertTo(Query)
        .toObject({
          computed: true,
          scope: true // invokes required
        })
        .build()

      let ModelCls = this.model(q.model)
      let orm = ModelCls[q.method]()

      delete q.model
      delete q.method

      for (let prop in q) {
        if (prop === 'populate') {
          let pop = q[prop]
          for (let i = 0; i < pop.length; i++) {
            if (ModelCls._belongsTo.indexOf(pop[i].model) !== -1) {
              pop.method = METHODS.FIND_ONE
            }
            orm[prop](pop)
          }
        } else {
          orm[prop](q[prop])
        }
      }

      // console.log('aql', await orm.toAQL())
      return resolve(orm)
    })
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
      throw new Error(ERRORS.COLLECTION_NOT_FOUND + collectionName)
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
