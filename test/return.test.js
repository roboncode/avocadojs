describe('return query', async () => {

  let orango, Model

  beforeAll(async () => {
    orango = require('../lib')
    Model = orango.model()
  })

  test('Model.return()', async () => {
    const { append } = orango.funcs
    let query = Model.return(append([1, 2, 3], [3, 4, 5], true))
    
    let aql = await query.toAQL()
    expect(aql).toBe('LET result = APPEND([1,2,3],[3,4,5],true) RETURN result')
  })
  
})