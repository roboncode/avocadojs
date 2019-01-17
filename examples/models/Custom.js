module.exports = ({ orango }) => {

  let schema = new orango.Schema({
    avatar: String,
    primaryColor: String,
    secondaryColor: String,
    backgroundImage: String
  })

  // do not create a collection for model (false)
  return orango.model('Custom', schema, false)

}
