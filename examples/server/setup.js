require('app-module-path').addPath(__dirname)
const orango = require('orango')
const config = require('config')

// listen for connection to ArangoDB
orango.events.on('connected', () => {
  console.log(
    'Connected to ArangoDB:'.green,
    orango.connection.url + '/' + orango.connection.name
  )
})

async function main() {
  // connect to ArangoDB as root
  await orango.connect(
    '_system',
    { username: 'root', password: 'orangorocks' }
  )
  // create db with credentials
  await orango.createDatabase(config.DB_NAME, [
    { username: config.DB_ADMIN_USER, password: config.DB_ADMIN_PASS }
  ])
  // disconnect from db
  await orango.disconnect()

  console.log('Database created:'.green, config.DB_NAME)

  try {
    await orango.connect(
      config.DB_NAME,
      { username: config.DB_ADMIN_USER, password: config.DB_ADMIN_PASS }
    )
  } catch(e) {
    console.log('error', e.message)
  }
}

main()
