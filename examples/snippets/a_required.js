module.exports = async ({ orango }) => {
  const schema = new orango.Schema({
    foo: { type: String, required: 'insert' },
    bar: { type: String, required: 'update' },
    baz: { type: String, required: true }
  })

  const FooBarBaz = orango.model('FooBarBaz', schema)
  await FooBarBaz.ready()
  // TODO: Fix this because model (collection) does not get created immediatly so throws an errro
  // let result = await FooBarBaz.insert({
  //   foo: 'a',
  //   baz: 'a'
  // })//.toAQL(true)
  // console.log(result)

  // FooBarBaz.update({})
  //   .where({ _key: '123' })
  //   .exec()

  // setTimeout(() => {
    let foo = new FooBarBaz({
      foo: 'hello',
      baz: 'goodbye'
    })
    await foo.save()
    foo.bar = 'au revoir'
    await foo.save()
  // }, 1000)
}
