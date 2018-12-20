let orango = require('../../../lib')
const UserMultiDB = require('../models/UserMultiDB')

async function connectDatabase(dbName) {
  const db = orango.get(dbName)
  if (!db.connection.connected) {
    db.events.on('connected', (instanace) => {
      console.log(`Conneted to ${instanace.name}`)
    })
    await db.connect(dbName)
    UserMultiDB(db)
  } else {
    console.log(`Getting ${db.connection.name}`)
  }
  return db
  }

async function ensureDatabases() {
  let User
  await orango.connect()
  await orango.createDatabase('sample1')
  User = await orango.model('User')
  User.truncate()

  await orango.createDatabase('sample2')
  User = await orango.model('UserMultiDB')
  User.truncate()
}

async function main() {
  ensureDatabases()

  for (let i = 0; i < 10; i++) {
    if (i % 2 == 0) {
      orango = await connectDatabase('sample1')
      let User = await orango.model('User')
      let user = new User({
        email: `user${i}@sample.com`
      })
      await user.save()
    } else {
      orango = await connectDatabase('sample2')
      let User = await orango.model('User')
      let user = new User({
        email: `user${i}@sample.com`
      })
      await user.save()
    }
  }
}

main()
