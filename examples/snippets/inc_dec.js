module.exports = async ({ orango }) => {
  const Stats = orango.model('Stats')

  let val = 10

  let query = Stats.update({
    friends: `++${val}`,
    likes: `--${val}`,
    following: `@{@doc.friends + ${val}}`
  })
  .name('s') // this is not required. this just demos @doc will parse into 's'
  .byId('1')

  // FOR DEMO ONLY - show the raw query data
  let queryData = JSON.stringify(query)
  console.log(queryData.green)

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // exec query
  let rawData = await query.exec()
  console.log('rawData'.green, rawData)

  // convert data to model
  let user = Stats.fromJSON(rawData)
  console.log('modelData'.green, user)
}
