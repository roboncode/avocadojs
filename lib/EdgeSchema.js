const OrangoSchema = require('./Schema')

class OrangoEdgeSchema extends OrangoSchema {
  constructor(fromModel, toModel) {
    super(
      {
        _from: String,
        _to: String
      },
      {
        // strict: true,
        edge: true
      }
    )
    this.from = fromModel
    this.to = toModel
    this.isEdge = true
  }
}

module.exports = OrangoEdgeSchema
