module.exports = async ({ orango }) => {

  const schema = new orango.Schema({
    type: { type: String }
  })
  
  const Model = orango.model('MyModel', schema)
  
  const model = new Model({
    type: 'Hello, world!'
  })
  
  let result = await model.validate()

  console.log(result)
}
