let orango = require('../../../lib')

async function connectDatabase(dbName){
  const db = orango.get(dbName)
  if(!db.connection.connected){
    db.events.on('connected', (instanace) => {
      console.log(`Conneted to ${instanace.name}`)
    })
    await db.connect(dbName)
  }else{
    console.log(`Getting ${db.connection.name}`)
  }
  return db
}


async function main() {
  orango = await connectDatabase('sample2')
  orango = await connectDatabase('sample3')
  orango = await connectDatabase('sample2') // If Reconnect get sample2, instead of error.
  orango = await connectDatabase('sample3') // If Reconnect get sample2, instead of error.
  console.log(`Present database is ${orango.connection.name}`)
}

main()
