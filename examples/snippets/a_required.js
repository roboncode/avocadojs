module.exports = async ({ orango }) => {
  const schema = new orango.Schema({
    foo: { type: String, required: 'insert' },
    bar: { type: String, required: 'update' },
    baz: { type: String, required: true }
  })

  const FooBarBaz = orango.model('FooBarBaz', schema)
  FooBarBaz.update({})
    .where({ _key: '123' })
    .exec()
  // let foo = new FooBarBaz()
  // foo.save()
}
