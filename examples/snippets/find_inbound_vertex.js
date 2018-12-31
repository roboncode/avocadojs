module.exports = async ({ orango }) => {
  const Comment = orango.model('Comment')
  const User = orango.model('User')

  let query = Comment.find()
    .inbound('tweet', '1', {})
    .limit(1)
    .return(orango.return.distinct())  

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // exec query
  let rawData = await query.exec()
  console.log('rawData'.green, rawData)

  // convert data to model
  let users = User.fromJSON(rawData)
  console.log('modelData'.green, users)
}
