module.exports = async ({ orango }) => {
  // get a reference to User model
  const Tweet = orango.model('Tweet')
  const { append, minus } = orango.funcs

  // create query
  let query = Tweet.update({
    text: 'Orango rocks!',
    tags: minus(append('@{@doc.tags}', ['orango']), ['band'])
  })
    .byId(1)
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
