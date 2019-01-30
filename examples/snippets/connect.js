module.exports = async ({ orango }) => {
  const db = orango.get('examples')
  await db.connect()
  console.log('✅  Connected to:'.green, db.connection.connected, db.connection.url + '/' + db.connection.name)
}
