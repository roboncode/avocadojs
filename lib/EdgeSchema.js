const OrangoSchema = require('./Schema')

class OrangoEdgeSchema extends OrangoSchema {
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

module.exports = OrangoEdgeSchema
