
let orango = require('../lib')

async function globalTeardown (){
  let dbs = await orango.get('system').connection.db.listDatabases()

  if (dbs.indexOf('test') !== -1) {
    await orango.get('system').dropDatabase('test')
  }

  if (dbs.indexOf('model_tests') !== -1) {
    await orango.get('system').dropDatabase('model_tests')
  }

  if (dbs.indexOf('disconnect') !== -1) {
    await orango.get('system').dropDatabase('disconnect')
  }

  if (dbs.indexOf('custom') !== -1) {
    await orango.get('system').dropDatabase('custom')
  }

  if (dbs.indexOf('edge') !== -1) {
    await orango.get('system').dropDatabase('edge')
  }

  if (dbs.indexOf('auth') !== -1) {
    await orango.get('system').dropDatabase('auth')
  }
};

module.exports = globalTeardown