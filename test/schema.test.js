describe('schema', () => {
  let orango

  beforeAll(async () => {
    orango = require('./__mocks__/orango')
  })

  test('test reserved word type', async () => {
    const schema = new orango.Schema({
      type: String
    })

    const Model = orango.model('TypeErrModel', schema)

    const model = new Model({
      type: 'foo'
    })

    let err
    try {
      await model.validate()
    } catch(e) {
      err = e
    }
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe(`"value" must be a string`)
  })

  test('test reserved word type as struct', async () => {
    const schema = new orango.Schema({
      type: { type: String }
    })

    const Model = orango.model('TypeValidModel', schema)

    const model = new Model({
      type: 'foo'
    })

    let result = await model.validate()
    expect(result).toEqual({type: 'foo'})
  })

  test('test array of strings', async () => {
    const schema = new orango.Schema({
      tags: [String]
    })

    const Model = orango.model('ArrStrModel', schema)

    const model = new Model({
      tags: ['a', 'b', 'c']
    })

    let result = await model.validate()
    expect(result).toEqual({tags: ['a', 'b', 'c']})
  })

})
