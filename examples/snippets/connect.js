module.exports = async ({ orango, config }) => {
  let system_db = orango.get() // defaults to "_system_db" database
  const { EVENTS } = orango.consts

  const cfg = {
    db: 'examples_conn',
    name: 'Admin',
    credentials: {
      username: 'admin',
      password: 'secretpass'
    }
  }

  async function initDatabase() {
    await system_db.connect(config.credentials)
    await system_db.dropDatabase(cfg.db)
    await system_db.createDatabase(cfg.db, [
      {
        username: cfg.credentials.username,
        password: cfg.credentials.password,
        extra: {
          name: cfg.name
          // TODO: Not supported by ArangoDB JS Driver
          // grant: 'rw' // administrate
          // grant: 'ro' // access
          // grant: 'none' // no access
          // grant: undefined // use default
        }
      }
    ])
    await system_db.disconnect()
  }

  await initDatabase()

  let app_db = orango.get(cfg.db)

  app_db.events.once(EVENTS.CONNECTED, conn => {
    console.log('🥑  Connected to ArangoDB:'.green, conn.url + '/' + conn.name)
  })

  app_db.events.once(EVENTS.READY, () => {
    console.log('🍊  Orango is ready!'.green)
  })

  // TODO: Using system config until support for granting rights is supported by ArangoDB JS Driver
  // await app_db.connect(cfg.credentials) 
  await app_db.connect(config.credentials)
}

