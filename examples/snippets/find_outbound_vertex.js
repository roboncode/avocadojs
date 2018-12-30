module.exports = async ({ orango }) => {
  const Comment = orango.model('Comment')
  const Tweet = orango.model('Tweet')

  let query = Comment.find()
    .outbound('user', 'eddie', {})
    .return(orango.return.distinct())  

  // // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // // find first item in users collection
  let rawData = await query.exec()
  console.log('rawData'.green, rawData)

  // // convert data to model
  let tweets = Tweet.fromJSON(rawData)
  console.log('modelData'.green, tweets)
}
