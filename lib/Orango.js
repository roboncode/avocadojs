const { EventDispatcher } = require('tangjs')
const { definePrivateProperty } = require('tangjs/lib/helpers')
const { Builder } = require('tangjs/lib')
const EventEmitter = require('events')
const Connection = require('./Connection')
const Model = require('./Model')
const Return = require('./Return')
const Schema = require('./Schema')
const Query = require('./models/Query')
const helpers = require('./helpers')
const createUniqueId = require('./helpers/createUniqueId')
const merge = require('lodash/merge')
const CONSTS = require('./consts')
const { ERRORS, EVENTS, METHODS } = CONSTS
const pluralize = require('pluralize')
const convertToSnakecase = require('./helpers/convertToSnakecase')
const { createLogger, format, transports, addColors } = require('winston')
addColors({
  info: 'bold cyan'
})
const logger = createLogger({
  level: 'warn',
  format: format.combine(
    format.colorize({ message: false }),
    format.simple()
  ),
  transports: [new transports.Console()]
})
require('colors')

const sleep = ms => new Promise(res => setTimeout(res, ms))

class Orango extends EventEmitter {
  static get(name = '_system') {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[name]) {
      this._instances[name] = new Orango(name)
    }
    return this._instances[name]
  }

  constructor(name = '_system') {
    super()
    this.name = name
    this.Types = Schema.Types
    this.models = {}
    this.collectionsCreated = []
    this.pendingModels = []
    definePrivateProperty(this, '$instanceName', name)
    this.events = EventDispatcher.getInstance(name)
    this.connection = Connection.getInstance(name)
    this.helpers = helpers
    this.CONSTS = CONSTS
    this.Model = Model
    this.logger = logger

    this.connection.once(EVENTS.CONNECTED, () => {
      this.log('info', `connected to ${this.connection.url}/${this.connection.name}`)
      for (let i = 0; i < this.pendingModels.length; i++) {
        this._createCollection(this.pendingModels[i])
      }
    })
  }

  log(...rest) {
    return logger.log.apply(logger, rest)
  }

  get(name = '_system') {
    return Orango.get(name)
  }

  builder(name = '_system') {
    return Builder.getInstance(name)
  }

  connect(options = {}) {
    merge(
      { url: 'http://localhost:8529', username: 'root', password: '' },
      options
    )
    return new Promise(async (resolve, reject) => {
      try {
        let db = await this.connection.connect(
          this.name,
          options
        )
        await sleep()
        resolve(db)
      } catch(e) {
        reject(e)
      }
    })
  }

  async disconnect() {
    if (this.connection) {
      let conn = this.connection.url + '/' + this.connection.name
      await this.connection.disconnect()
      this.log('info', `disconnected from ${conn}`)
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
      this.log('info', `created database "${name}"`)
      this.emit(EVENTS.DATABASE_CREATED, name)
      EventDispatcher.getInstance(this.$instanceName).emit(
        EVENTS.DATABASE_CREATED,
        name
      )
    }
  }

  async dropDatabase(name) {
    // TODO: Check if currently logged into _system
    if (this.connection && this.connection.connected) {
      const names = await this.connection.db.listDatabases()
      if (names.indexOf(name) !== -1) {
        this.connection.db.dropDatabase(name)
        this.log('info', `dropped database "${name}"`)
        this.emit(EVENTS.DATABASE_DROPPED, name)
        EventDispatcher.getInstance(this.$instanceName).emit(
          EVENTS.DATABASE_DROPPED,
          name
        )
      }
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
      if (model.schema.options.isEdge) {
        this.log('info', 'creating edge collection => ' + model.collectionName)
        await this.createEdgeCollection(model.collectionName)
      } else {
        this.log('info', 'creating document collection => ' + model.collectionName)
        await this.createCollection(
          model.collectionName,
          model.schema.options.indexes
        )
      }
      // model.emit(EVENTS.READY, model)
    }
  }

  uid() {
    return createUniqueId()
  }

  get return() {
    return new Return()
  }

  Schema(jsonSchema, options = {}) {
    return new Schema(jsonSchema, options)
  }

  model(name, ClassRef, collectionName) {
    // this is used to check if a return promise is expected
    let isWaiting = false

    if (ClassRef) {
      if (this.models[name]) {
        throw new Error(ERRORS.MODEL_EXISTS.split('{name}').join(name))
      }

      this.models[name] = ClassRef
      ClassRef.orango = this

      if (collectionName !== false) {
        ClassRef.collectionName =
          collectionName || convertToSnakecase(pluralize(name))
        // this is used if they are waiting for a connection
        ClassRef.then = async resolve => {
          isWaiting = true
          // must delete then() to prevent recursive loop
          delete ClassRef.then
          // wait for connection
          await this._createCollection(ClassRef)
          // resolve promise
          resolve(ClassRef)
        }

        setImmediate(async () => {
          if (!isWaiting) {
            // must delete then() to prevent recursive loop
            delete ClassRef.then

            if (this.connection.connected) {
              await this._createCollection(ClassRef)
            } else if (this.pendingModels.indexOf(ClassRef) === -1) {
              this.pendingModels.push(ClassRef)
            }
          }
        })
      }
    } else if (!this.models[name]) {
      let notFound = ERRORS.MODEL_NOT_FOUND.split('{name}').join(name)
      throw new Error(notFound)
    }

    return this.models[name]
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
