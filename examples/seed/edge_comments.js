module.exports = async ({ orango }) => {
  const Comment = orango.model('Comment')
  console.log(`✅  Populated "${Comment.collectionName}" collection`.green)

  await Comment.import([
    {
      _from: 'users/eddie',
      _to: 'tweets/1',
      message: 'Hello, world!'
    },
    {
      _from: 'users/eddie',
      _to: 'tweets/2'
    }
  ])
}
