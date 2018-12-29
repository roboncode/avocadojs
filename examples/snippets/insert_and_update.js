module.exports = async ({ orango }) => {
  const User = orango.model('User')
  const Identity = orango.model('Identity')

  let query = User.insert({
    firstName: 'John',
    lastName: 'Smith',
    bogus: true
  })
    .query(
      'id1',
      Identity.update({
        provider: 'hello',
        verified: true
      }).where({
        _key: '123'
      })
    )
    .return()

  // FOR DEMO ONLY - show the raw query data
  let queryData = JSON.stringify(query)
  console.log(queryData.green)

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)
}
