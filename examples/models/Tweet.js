module.exports = ({ orango }) => {
  class Tweet extends orango.Model {
    constructor(data) {
      super(data, Tweet.schema)
    }
  }

  Tweet.schema = orango.Schema(
    {
      user: String,
      text: String
    }
  )

  return orango.model('Tweet', Tweet)
}
