const RETURN = require('./return')

module.exports = {
  ALREADY_CONNECTED: 'Connection already established',
  COLLECTION_NOT_FOUND: 'Collection not found: ',
  EDGE_MODEL_REQUIRED: 'Edge model required',
  ID_REQUIRED: 'Id required',
  INVALID_COLLECTION: 'factory expects "collectionName" to be string',
  INVALID_RETURN: `Return value must be "${RETURN.ONE}", "${RETURN.MANY}", "${RETURN.MODEL}" or "${RETURN.MODELS}"`,
  MODEL_EXISTS: `A model with the {name} already exists`,
  MODEL_NOT_FOUND: 'Model not found: {name}',
  NOT_CONNECTED: 'Not connected to database',
  USER_EXISTS: 'User exists'
}
