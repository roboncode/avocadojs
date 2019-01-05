const { EventDispatcher } = require('tangjs')
const { definePrivateProperty } = require('tangjs/lib/helpers')
// const { Builder } = require('tangjs/lib')
const Joi = require('joi')
const EventEmitter = require('events')
const Database = require('arangojs').Database
const Connection = require('./Connection')
const Model = require('./Model')
const Return = require('./Return')
const Schema = require('./Schema')
const helpers = require('./helpers')
const consts = require('./consts')
const { DEFAULTS, ERRORS, EVENTS, SCHEMA } = consts
const pluralize = require('pluralize')
const convertToSnakecase = require('./helpers/convertToSnakecase')
const { createLogger, format, transports, addColors } = require('winston')
addColors({ info: 'bold cyan' })
const logger = createLogger({
  level: 'warn',
  format: format.combine(format.colorize({ message: false }), format.simple()),
  transports: [new transports.Console()]
})
require('colors')

class Orango extends EventEmitter {
  static get(database = DEFAULTS.DATABASE) {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[database]) {
      this._instances[database] = new Orango(database)
    }
    return this._instances[database]
  }

  constructor(database = DEFAULTS.DATABASE) {
    super()
    // private properties
    definePrivateProperty(this, '_models', {})
    definePrivateProperty(this, '_collectionsCreated', [])
    definePrivateProperty(this, '_pendingModels', [])
    definePrivateProperty(this, '_database', database)
    definePrivateProperty(this, '_state', {})
    definePrivateProperty(this, '_processModelsTimer', null)

    // public properties
    this.connection = new Connection(Database)
    this.consts = consts
    this.events = EventDispatcher.getInstance(database)
    this.logger = logger
    this.Model = Model

    this.types = Schema.Types
    this.types.Schema = model => {
      let joi = Joi.lazy(() => {
        return this.model(model).schema.joi
      })
      joi.model = model
      return joi
    }

    this.model('OrangoModel', Model, false)

    this.connection.once(EVENTS.CONNECTED, () => {
      this.log(
        'info',
        `connected to ${this.connection.url}/${this.connection.name}`
      )
      // see if there were any pending models in the process
      this._processModelsTimer = setTimeout(() => {
        this._processModels()
      })
    })
  }

  get return() {
    return new Return()
  }

  get funcs() {
    return helpers.aqlFuncs
  }

  async _processModels() {
    let len = this._processModels.length
    if (this._pendingModels.length) {
      let _pendingModels = this._pendingModels.slice(0)
      this._pendingModels.length = 0
      let promises = []
      for (const model of _pendingModels) {
        promises.push(this._createCollection(model))
      }
      await Promise.all(promises)
    }
    this.events.emit(EVENTS.CONNECTED)
    if (len) {
      this.events.emit(EVENTS.READY, this.connection)
    }
  }

  _onConnected() {
    if (!model.then) {
      this._createCollection(model)
    }
  }

  log(...rest) {
    return logger.log.apply(logger, rest)
  }

  get(database = DEFAULTS.DATABASE) {
    return Orango.get(database)
  }

  connect(options = {}) {
    options = Object.assign(
      {
        url: DEFAULTS.URL,
        username: DEFAULTS.USERNAME,
        password: DEFAULTS.PASSWORD
      },
      options
    )

    return new Promise(async (resolve, reject) => {
      try {
        let db

        this.events.once(EVENTS.CONNECTED, () => {
          resolve(db)
        })

        db = await this.connection.connect(
          this._database,
          options
        )
      } catch (e) {
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

  async createDatabase(database, users = []) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].hasOwnProperty('password')) {
        users[i].passwd = users[i].password
        delete users[i].password
      }
    }
    const db = this.connection.db
    const names = await db.listDatabases()
    if (names.indexOf(database) === -1) {
      await db.createDatabase(database, users)
      this.log('info', `created database "${database}"`)
      this.emit(EVENTS.DATABASE_CREATED, database)
      EventDispatcher.getInstance(database).emit(
        EVENTS.DATABASE_CREATED,
        database
      )
    }
  }

  async dropDatabase(database) {
    if (
      this.connection &&
      this.connection.connected &&
      this._database === DEFAULTS.DATABASE
    ) {
      const names = await this.connection.db.listDatabases()
      if (names.indexOf(database) !== -1) {
        this.connection.db.dropDatabase(database)
        this.log('info', `dropped database "${database}"`)
        this.emit(EVENTS.DATABASE_DROPPED, database)
        EventDispatcher.getInstance(database).emit(
          EVENTS.DATABASE_DROPPED,
          database
        )
      }
    }
  }

  async _createCollection(model) {
    if (this._collectionsCreated.indexOf(model.collectionName) === -1) {
      let collection
      this._collectionsCreated.push(model.collectionName)
      if (model.schema.options.type === 'edge') {
        collection = await this.createEdgeCollection(
          model.collectionName,
          model.schema.options.indexes
        )
      } else {
        collection = await this.createCollection(
          model.collectionName,
          model.schema.options.indexes
        )
      }
      model.collection = collection
    }
  }

  checkConnected() {
    if (!this.connection.connected) {
      throw new Error(ERRORS.NOT_CONNECTED)
    }
  }

  queryToAQL(query, formatted = false) {
    return helpers.queryToAQL(this).generate(query, formatted)
  }

  schema(jsonSchema, options = {}) {
    let schema = new Schema(jsonSchema, options)
    schema.orango = this
    return schema
  }

  model(name, ClassRef, collectionName) {
    if (ClassRef) {
      if (this._models[name]) {
        throw new Error(ERRORS.MODEL_EXISTS.split('{name}').join(name))
      }

      clearTimeout(this._processModelsTimer)

      this._models[name] = ClassRef

      ClassRef.then = async resolve => {
        delete ClassRef.then
        this.events.once(EVENTS.CONNECTED, () => {
          resolve()
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.events.emit(EVENTS.READY, this.connection)
          })
        })
      }

      if (collectionName !== false) {
        ClassRef.collectionName =
          collectionName || convertToSnakecase(pluralize(name))

        if (this._pendingModels.indexOf(ClassRef) === -1) {
          this._pendingModels.push(ClassRef)
        }

        if (this.connection.connected) {
          clearTimeout(this._timer)
          this._timer = setTimeout(() => {
            this._processModels()
          })
        }
      }
    }
    if (!name) {
      Model.orango = this
      return Model
    }

    if (!this._models[name]) {
      let notFound = ERRORS.MODEL_NOT_FOUND.split('{name}').join(name)
      throw new Error(notFound)
    }

    ClassRef = this._models[name]
    // model can be assigned to different instances of the Orango, as its being requested
    ClassRef.orango = this

    return ClassRef
  }

  async createCollection(collectionName, indexes) {
    this.checkConnected()

    let conn = this.connection
    let collection = await conn.db.collection(collectionName)
    let exists = await collection.exists()
    if (!exists) {
      this.log('info', 'create document collection => ' + collectionName)
      await collection.create()
    }

    if (indexes) {
      await this.ensureIndexes(collectionName, indexes)
    }

    return collection
  }

  async createEdgeCollection(collectionName, indexes = []) {
    this.checkConnected()

    let conn = this.connection
    let collection = await conn.db.edgeCollection(collectionName)
    let exists = await collection.exists()
    if (!exists) {
      this.log('info', 'creating edge collection => ' + collectionName)
      await collection.create()
    }

    if (indexes) {
      await this.ensureIndexes(collectionName, indexes)
    }

    return collection
  }

  async ensureIndexes(collectionName, indexes = []) {
    this.checkConnected()

    let conn = this.connection
    let collection = await conn.db.collection(collectionName)
    let exists = await collection.exists()
    if (!exists) {
      throw new Error(ERRORS.COLLECTION_NOT_FOUND + collectionName)
    }
    this.log('info', 'setup indexes for collection => ' + collectionName)
    let promises = []
    for (let n = 0; n < indexes.length; n++) {
      let item = indexes[n]
      switch (item.type) {
        case SCHEMA.INDEX.HASH:
          promises.push(collection.createHashIndex(item.fields, item.opts))
          break
        case SCHEMA.INDEX.SKIP_LIST:
          promises.push(collection.createSkipList(item.fields, item.opts))
          break
        case SCHEMA.INDEX.GEO:
          promises.push(collection.createGeoIndex(item.fields, item.opts))
          break
        case SCHEMA.INDEX.FULLTEXT:
          promises.push(collection.createFulltextIndex(item.fields, item.opts))
          break
        case SCHEMA.INDEX.PERSISTENT:
          promises.push(collection.createPersitentIndex(item.fields, item.opts))
          break
      }
    }
    await Promise.all(promises)
  }

  async query(statement) {
    this.checkConnected()
    return await this.connection.db.query(statement)
  }
}

module.exports = Orango
