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
    .return(orango.return.one())

  // FOR DEMO ONLY - show the raw query data
  let queryData = JSON.stringify(query)
  console.log(queryData.green)

  console.log('\n⚠️  The following AQL cannot be executed because of a known bug in ArangoDB  ⚠️\n'.red)
  console.log('Follow it on: https://github.com/arangodb/arangodb/issues/7834')

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // // exec query
  // let rawData = await query.exec()
  // console.log('rawData'.green, rawData)

  // // convert data to model
  // let user = User.fromJSON(rawData)
  // console.log('modelData'.green, user)
}
