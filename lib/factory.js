const ArangoModel = require('./Model')
const Schema = require('./Schema')
// TODO: Find out why this fails
// const connection = require('../lib/connection')
const pluralize = require('pluralize')
const convertToSnakecase = require('./helpers/convertToSnakecase')

/**
 * Constructs an ArangoDocumentModel class
 * @param {*} name
 * @param {*} schema
 * @param {*} options
 */
function factory(name, schema, collectionName = '') {
  if(typeof collectionName !== 'string') {
    throw new Error('factory expects "collectionName" to be string')
  }
  collectionName = collectionName || convertToSnakecase(pluralize(name))
  if (!(schema instanceof Schema)) {
    schema = new Schema(schema)
  }
  class DocumentModel extends ArangoModel {
    constructor(data) {
      super(data, schema)
    }
  }
  DocumentModel.schema = schema
  DocumentModel.collectionName = collectionName

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
