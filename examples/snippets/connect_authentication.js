module.exports = async ({ orango }) => {
  const db = orango.get('sample')
  // THIS WILL FAIL
  try {
    await db.connect({
      url: 'http://localhost:10529',
      username: 'admin',
      password: 'secret'
    })
  } catch(e) {
    console.log('This is expected to because the database isn\'t setup with credentials.'.red)
  }
}
