const ArangoModel = require('./Model')
// TODO: Find out why this fails
// const connection = require('../arango/connection')
const inc = require('./queries/inc')
const pluralize = require('pluralize')
const convertToSnakecase = require('./helpers/convertToSnakecase')

/**
 * Constructs an ArangoDocumentModel class
 * @param {*} name
 * @param {*} schema
 * @param {*} options
 */
function factory(name, schema, options = {}, builder) {
  options.name = options.name
    ? options.name
    : convertToSnakecase(pluralize(name))

  class DocumentModel extends ArangoModel {
    constructor(data) {
      super(data, schema, options)
    }
  }
  DocumentModel.builder = builder
  DocumentModel.schema = schema
  DocumentModel.options = options

  Object.defineProperty(DocumentModel, 'name', {
    value: name
  })

  for (let name in schema.statics) {
    DocumentModel[name] = function() {
      return schema.statics[name].apply(DocumentModel, arguments)
    }
  }

  return DocumentModel
}

module.exports = factory
