const Model = require('./Model')
/**
 * Constructs a Model class
 * @param {*} name
 * @param {*} schema
 * @param {*} options
 */
function factory(name, schema = {}, options = {}) {
  class TangModel extends Model {
    constructor(data) {
      super(data, schema, options)
    }
  }

  TangModel.options = options
  TangModel.schema = schema

  Object.defineProperty(TangModel, 'name', { value: name })

  for (let name in schema.statics) {
    TangModel[name] = function() {
      return schema.statics[name].apply(TangModel, arguments)
    }
  }

  return TangModel
}

module.exports = factory