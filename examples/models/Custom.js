module.exports = ({ orango }) => {
  class Custom extends orango.Model {
    constructor(data) {
      super(data, Custom.schema)
    }
  }

  Custom.schema = orango.schema({
    avatar: String,
    primaryColor: String,
    secondaryColor: String,
    backgroundImage: String
  })

  // do not create a collection for model (false)
  return orango.model('Custom', Custom, false)
}
