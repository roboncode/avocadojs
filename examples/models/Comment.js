module.exports = ({ orango }) => {
  const schema = new orango.Schema({
    message: String
  })

  schema.type('edge', {
    from: 'User',
    to: ['Tweet', 'Comment']
  })

  return orango.model('Comment', schema)
}
