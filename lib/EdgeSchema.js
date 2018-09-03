const ArangoSchema = require('./Schema')

class ArangoEdgeSchema extends ArangoSchema {
  constructor(from, to) {
    super(
      {
        _from: String,
        _to: String
      },
      {
        strict: true,
        edge: true
      }
    )
    this.from = from
    this.to = to
    this.isEdge = true
  }
}

module.exports = ArangoEdgeSchema
