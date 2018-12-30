module.exports = async ({ orango }) => {
  const Stats = orango.model('Stats')
  console.log(`✅  Populated "${Stats.collectionName}" collection`.green)

  let query = Stats.import([
    {
      _key: '1',
      user: 'eddie',
      friends: 0,
      likes: 0
    }
  ])

  console.log('query', JSON.stringify(query))
  console.log('aql', await query.toAQL(true))

}
