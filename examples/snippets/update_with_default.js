module.exports = async ({ orango }) => {
  // get a reference to User model
  const User = orango.model('User')

  // create query
  let query = User.update({
    tags: ['80s'] // TODO: push, pull ?? needed or AQL functions takes care of this
  }).byId('eddie').return(orango.return.one())

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
  let user = User.fromJSON(rawData)
  console.log('modelData'.green, user)

  // get 
  console.log('Who is user?'.green, user.fullName)
}
