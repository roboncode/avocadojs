const { EventDispatcher } = require('tangjs')
const { definePrivateProperty } = require('tangjs/lib/helpers')
const { Builder } = require('tangjs/lib')
const EventEmitter = require('events')
const Database = require('arangojs').Database
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
  format: format.combine(format.colorize({ message: false }), format.simple()),
  transports: [new transports.Console()]
})
require('colors')

const sleep = ms => new Promise(res => setTimeout(res, ms))

class Orango extends EventEmitter {
  static get(dbName = '_system') {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[dbName]) {
      this._instances[dbName] = new Orango(dbName)
    }
    return this._instances[dbName]
  }

  constructor(dbName = '_system') {
    super()
    this.dbName = dbName
    this.Types = Schema.Types
    this.models = {}
    this.collectionsCreated = []
    this.pendingModels = []
    definePrivateProperty(this, '_database', dbName)
    this.events = EventDispatcher.getInstance(dbName)
    this.connection = new Connection(Database)
    this.helpers = helpers
    this.CONSTS = CONSTS
    this.Model = Model
    this.logger = logger

    this.connection.once(EVENTS.CONNECTED, () => {
      this.log(
        'info',
        `connected to ${this.connection.url}/${this.connection.name}`
      )
      console.log('PENDING MODELS LENGTH'.magenta, this.pendingModels.length)
      for (let i = 0; i < this.pendingModels.length; i++) {
        this._createCollection(this.pendingModels[i])
      }

      console.log('~~~~~~~~~~~~~~~~~~~READY'.green)
      // this.events.emit(EVENTS.READY)
    })
  }

  // async _createPendingCollections() {
  //   console.log('PENDING MODELS LENGTH'.magenta, this.pendingModels.length)
  //     for(const model of this.pendingModels) {
  //       await this._createCollection(model)
  //     }
  //   console.log('~~~~~~~~~~~~~~~~~~~READY'.green)
  //   this.events.emit(EVENTS.READY, model)
  // }

  log(...rest) {
    return logger.log.apply(logger, rest)
  }

  get(dbName = '_system') {
    return Orango.get(dbName)
  }

  builder(dbName = '_system') {
    return Builder.getInstance(dbName)
  }

  connect(options = {}) {
    merge(
      { url: 'http://localhost:8529', username: 'root', password: '' },
      options
    )
    return new Promise(async (resolve, reject) => {
      try {
        let db = await this.connection.connect(
          this.dbName,
          options
        )
        // used to ensure collections have been created before proceeding
        // await sleep(100)
        resolve(db)
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

  async createDatabase(dbName, users = []) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].hasOwnProperty('password')) {
        users[i].passwd = users[i].password
        delete users[i].password
      }
    }
    const db = this.connection.db
    const names = await db.listDatabases()
    if (names.indexOf(dbName) === -1) {
      await db.createDatabase(dbName, users)
      this.log('info', `created database "${dbName}"`)
      this.emit(EVENTS.DATABASE_CREATED, dbName)
      EventDispatcher.getInstance(this._database).emit(
        EVENTS.DATABASE_CREATED,
        dbName
      )
    }
  }

  async dropDatabase(dbName) {
    // TODO: Check if currently logged into _system
    if (this.connection && this.connection.connected) {
      const names = await this.connection.db.listDatabases()
      if (names.indexOf(dbName) !== -1) {
        this.connection.db.dropDatabase(dbName)
        this.log('info', `dropped database "${dbName}"`)
        this.emit(EVENTS.DATABASE_DROPPED, dbName)
        EventDispatcher.getInstance(this._database).emit(
          EVENTS.DATABASE_DROPPED,
          dbName
        )
      }
    }
  }

  queryToAQL(query, formatted = false) {
    return helpers.queryToAQL(this).generate(query, formatted)
  }

  checkConnected() {
    if (!this.connection.connected) {
      throw new Error(ERRORS.NOT_CONNECTED)
    }
  }

  async _createCollection(model) {
    if (this.collectionsCreated.indexOf(model.collectionName) === -1) {
      let collection
      this.collectionsCreated.push(model.collectionName)
      if (model.schema.options.type === 'edge') {
        collection = await this.createEdgeCollection(model.collectionName)
      } else {
        collection = await this.createCollection(
          model.collectionName,
          model.schema.options.indexes
        )
      }
      model.collection = collection
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
          console.log("INSIDE PROMISE".red)
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
              console.log('ALREADY CONNECTED'.red)
              await this._createCollection(ClassRef)
            } else if (this.pendingModels.indexOf(ClassRef) === -1) {
              console.log('SETUP PENDING MODELS'.yellow)
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

  async createEdgeCollection(collectionName) {
    this.checkConnected()

    let conn = this.connection
    let collection = await conn.db.edgeCollection(collectionName)
    let exists = await collection.exists()
    if (!exists) {
      this.log('info', 'creating edge collection => ' + collectionName)
      await collection.create()
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

  async query(statement) {
    this.checkConnected()
    return await this.connection.db.query(statement)
  }
}

module.exports = Orango
