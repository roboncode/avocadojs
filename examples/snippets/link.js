module.exports = async ({ orango }) => {
  // let result = Like.link('a', 'b', { bogus: true, notes: 'This is a test' })

  // get a reference to User model
  const Like = orango.model('Like')

  // create query
  let query = Like.link('a', 'b', { message: 'Hello, world!' })

  // FOR DEMO ONLY - show the raw query data
  let queryData = JSON.stringify(query)
  console.log(queryData.green)

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // find first item in users collection
  let rawData = await query.exec()
  console.log('rawData'.green, rawData)

  // convert data to model
  // let user = User.fromJSON(rawData)
  // console.log('modelData'.green, user)
}
