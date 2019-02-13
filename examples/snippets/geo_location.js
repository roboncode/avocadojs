module.exports = async ({ orango }) => {
  // get a reference to Site model
  const Site = orango.model('Site')

  // create query
  let query = Site.insert({
    name: 'KFC',
    location: [100]
  }).return(orango.return.one())

  // FOR DEMO ONLY - show the raw query data
  let queryData = JSON.stringify(query)
  console.log(queryData.green)

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL()
  console.log(aql.cyan)

  // // exec query
  // let rawData = await query.exec()
  // console.log('rawData'.green, rawData)

  // // convert data to model
  // let user = Site.fromJSON(rawData)
  // console.log('modelData'.green, user)
}
