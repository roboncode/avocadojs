module.exports = async ({ orango }) => {
  // get a reference to User model
  const Comment = orango.model('Comment')

  // create query
  let query = Comment.unlink(
    { user: 'eddie', tweet: '1' }
  )
  .return()

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // exec link
  let rawData = await query.exec()
  console.log('rawData'.green, rawData)
}
