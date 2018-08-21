const Model = require('./Model')
/**
 * Constructs a Model class
 * @param {*} name
 * @param {*} schema
 * @param {*} options
 */
function factory(name, schema = {}, options = {}) {
  class AvocadoModel extends Model {
    constructor(data) {
      super(data, schema, options)
    }
  }

  AvocadoModel.options = options
  AvocadoModel.schema = schema

  Object.defineProperty(AvocadoModel, 'name', { value: name })

  for (let name in schema.statics) {
    AvocadoModel[name] = function() {
      return schema.statics[name].apply(AvocadoModel, arguments)
    }
  }

  return AvocadoModel
}

module.exports = factory