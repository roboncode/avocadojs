module.exports = ({ orango }) => {
  const schema = new orango.Schema(
    {
      user: String,
      friends: { type: orango.types.Any, default: 0 },
      likes: { type: orango.types.Any, default: 0 },
      following: { type: orango.types.Any, default: 0 }
    }
  )

  schema.addIndex('hash', 'user')

  return orango.model('Stats', schema)
}
