module.exports = async ({ orango }) => {
  const Tweet = orango.model('Tweet')
  console.log(`✅  Populated "${Tweet.collectionName}" collection`.green)

  await Tweet.import([
    {
      _key: '1',
      user: 'eddie',
      text: 'My first tweet',
      tags: ['guitar', 'band']
    },
    {
      _key: '2',
      user: 'eddie',
      text: 'My second tweet',
      tags: ['guitar', 'band']
    }
  ])
}
