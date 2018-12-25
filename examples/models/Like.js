module.exports = orango => {
  class Like extends orango.Model {
    constructor(data) {
      super(data, Like.schema)
    }
  }

  /**
   * Validates data going to ArangoDB
   */
  Like.schema = orango.Schema(
    {
      _from: String,
      _to: String,
      message: String
    },
    {
      strict: false,
      isEdge: true,
      from: 'Band',
      to: 'Member'
    }
  )

  return orango.model('Like', Like)
}
