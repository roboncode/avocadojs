module.exports = async ({ orango, config }) => {
  let system_db = orango.get() // defaults to "_system_db" database
  const { EVENTS } = orango.consts

  const cfg = {
    db: 'examples_noauth'
  }

  async function initDatabase() {
      // since we are not using the default url http://localhost:8529, we pass it in
    await system_db.connect(config.default)
    await system_db.dropDatabase(cfg.db)
    await system_db.createDatabase(cfg.db)
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

  await app_db.connect(config.default)
}

