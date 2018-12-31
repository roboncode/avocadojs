module.exports = async ({ orango }) => {
  // get a reference to User model
  const Comment = orango.model('Comment')

  // create query
  let query = Comment.link(
    { user: 'eddie', tweet: '1' },
    { message: 'This is the first comment' }
  )
  .return()

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // exec query
  let rawData = await query.exec()
  console.log('rawData'.green, rawData)
}
