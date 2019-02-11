module.exports = async ({ orango }) => {
  const User = orango.model('User')
  const Identity = orango.model('Identity')

  // TODO: THIS N
  let query = User.insert({
    firstName: 'John',
    lastName: 'Smith',
    bogus: true
  })
    .query(
      Identity.insert({
        _key: '1',
        user: 'john',
        provider: 'orango',
        identifier: 'john@smith.com',
        passwordHash: 'abcdefg12345678',
        connection: 'Username-Password-Authentication',
        isSocial: false,
        verified: false
      }).where({
        _key: '123'
      })
    )
    .return({ return: one })

  // FOR DEMO ONLY - show the raw query data
  let queryData = JSON.stringify(query)
  console.log(queryData.green)

  // console.log('\n⚠️  The following AQL cannot be executed because of a known bug in ArangoDB  ⚠️\n'.red)
  // console.log('Follow it on: https://github.com/arangodb/arangodb/issues/7834')
  // 😀 Fixed in arangdb@3.4.2

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // exec query
  let rawData = await query.exec()
  console.log('rawData'.green, rawData)

  // convert data to model
  let user = User.fromJSON(rawData)
  console.log('modelData'.green, user)
}
