module.exports = async ({ orango }) => {
  const Stats = orango.model('Stats')
  console.log(`✅  Populated "${Stats.collectionName}" collection`.green)

  await Stats.import([
    {
      _key: '1',
      user: 'eddie',
      likes: 100,
      friends: 100,
      following: 100
    }
  ]).withDefaults()

}
