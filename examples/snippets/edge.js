module.exports = async ({ orango }) => {
  // get a reference to User model
  const Comment = orango.model('Comment')

  // create query
  let query = Comment.link(
    { user: 'eddie', tweet: '1' },
    { message: 'This is the first comment' }
  )
  // .return()

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // find first item in users collection
  // let rawData = await query.exec()
  // console.log('rawData'.green, rawData)
  // await orango.disconnect()
  // await orango.connect()
  // setTimeout(async () => {
  let rawData = await query.exec()
  console.log('rawData'.green, rawData)
  // }, 8000)
}
