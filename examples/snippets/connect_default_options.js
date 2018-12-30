module.exports = async ({ orango }) => {
  const db = orango.get('sample')
  await db.connect()
  console.log('✅  Connected to:'.green, db.connection.url + '/' + db.connection.name)
}
