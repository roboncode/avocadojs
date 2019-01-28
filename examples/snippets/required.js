module.exports = async ({ orango }) => {
  const schema = new orango.Schema({
    foo: { type: String, required: 'insert' },
    bar: { type: String, required: 'update' },
    baz: { type: String, required: true }
  })

  // If you are going to create a model in code and then use it right after,
  // you will need to wait for a "ready" state so it can connect to 
  // the collection, ensure indicies etc
  const FooBarBaz = orango.model('FooBarBaz', schema)
  // wait for model to be initialized
  await FooBarBaz.ready()

  // This insert will fail because "foo" and "baz" are required
  let fbz = new FooBarBaz()
  try {
    await fbz.save()
  } catch(e) {
    console.log('Insert failed'.red, e.message)
  }

  // Thiw will pass
  fbz.foo = 'example'
  fbz.baz = 'example'

  await fbz.save()

  // This update will fail becase "bar" is required, "baz" was defined above
  try {
    await fbz.save()
  } catch(e) {
    console.log('Update failed'.red, e.message)
  }

  // Thiw will pass
  fbz.bar = "example"
  await fbz.save()
}
