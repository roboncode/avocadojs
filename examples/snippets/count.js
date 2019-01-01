module.exports = async ({ orango }) => {
  // get a reference to User model
  const User = orango.model('User')

  // create query
  let query = User.count()
    .where({ active: true })
    .return(orango.return.one())

    // FOR DEMO ONLY - show the raw query data
  let queryData = JSON.stringify(query)
  console.log(queryData.green)

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // exec query
  let rawData = await query.exec()
  console.log('rawData'.green, rawData)
}
