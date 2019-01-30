module.exports = ({ orango }) => {
  const { SCHEMA } = orango.consts

  const schema = new orango.Schema(
    {
      user: String,
      friends: { type: orango.types.Any, default: 0 },
      likes: { type: orango.types.Any, default: 0 },
      following: { type: orango.types.Any, default: 0 }
    }
  )

  schema.addIndex(SCHEMA.INDEX.HASH, 'user')

  return orango.model('Stats', schema)
}
