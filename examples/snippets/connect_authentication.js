module.exports = async ({ orango }) => {
  const db = orango.get('examples')
  // THIS WILL FAIL
  try {
    await db.connect({
      // string or array, see: https://docs.arangodb.com/devel/Drivers/JS/Reference/Database/
      url: 'http://localhost:8529',
      isAbsolute: false,
      loadBalancingStrategy: 'NONE',
      maxRetries: 3,
      username: 'admin',
      password: 'secret'
    }, {
      
    })
  } catch (e) {
    console.log('Error returned', e.message)
    console.log("This is expected to because the database isn't setup with credentials.".red)
  }
}
