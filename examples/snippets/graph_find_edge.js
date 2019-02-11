module.exports = async ({ orango }) => {
  const Comment = orango.model('Comment')
  const Tweet = orango.model('Tweet')

  let query = Comment.find()
    .edge('user', 'eddie', {})
    .return(orango.return.distinct())  

  // // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // exec query
  let rawData = await query.exec()
  console.log('rawData'.green, rawData)

  // convert data to model
  let tweets = Tweet.fromJSON(rawData)
  console.log('modelData'.green, tweets)
}

Fight.find().graph('airport', 'flight').in(1, 5).outbound()