module.exports = ({ orango }) => {
  const schema = new orango.Schema(
    {
      message: String
    },
    {
      type: 'edge',
      from: 'User',
      to: ['Tweet', 'Comment']
    }
  )

  return orango.model('Comment', schema)
}
