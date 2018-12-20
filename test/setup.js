let orango = require('../lib')

async function connectToDefaultDb() {
  // connect to default database
  await orango.connect()
  // create databases
  await orango.createDatabase('test')
  await orango.createDatabase('model_tests')
  await orango.createDatabase('disconnect')
  await orango.createDatabase('custom')
  await orango.createDatabase('edge')
  await orango.createDatabase('auth')
  // disconnect from default database
  await orango.disconnect()
  // connect to test db
  await orango.connect('test')
  // connect to system db
  await orango.get('system').connect()
  // this db is used for the purpose of disconnecting test
  await orango.get('disconnect').connect()

  // create Test model
  await orango.model('Test', {
    name: {
      type: String,
      default: 'test'
    },
    comments: [{ $id: String, text: String }],
    tags: [String]
  })
  await orango.disconnect()
}

module.exports =  async () => {
  await connectToDefaultDb()
};
