module.exports = ({ orango }) => {
  let schema = new orango.Schema({
    avatar: String,
    primaryColor: { type: String, default: '#000000', defaultOnUpdate: '#999' },
    secondaryColor: { type: String, default: '#000000' },
    backgroundImage: { type: String, default: '#000000' }
  })

  // do not create a collection for model (false)
  return orango.model('Custom', schema, false)
}
