module.exports = ({ orango }) => {
  let schema = new orango.Schema({
    user: String,
    text: String,
    tags: orango.types.Array,
    created: { type: Date, default: Date.now },
    updated: { type: Date, defaultOnUpdate: Date.now }
  })

  return orango.model('Tweet', schema)
}
