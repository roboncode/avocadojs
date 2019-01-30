module.exports = async ({ orango }) => {
  // get a reference to User model
  const User = orango.model('User')

  // create query
  let query = User.update({
    tags: ['80s'] // TODO: push, pull ?? needed or AQL functions takes care of this
  }).byId('eddie').return(orango.return.one().model())

  // FOR DEMO ONLY - show the raw query data
  let queryData = JSON.stringify(query)
  console.log(queryData.green)

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // convert data to model
  let user = await query.exec()
  console.log('modelData'.green, user)

  // get computed property
  console.log('Computed property'.green, user.fullName)

  // convert to JSON (with computed properties)
  // let json = user.toJSON()
  console.log('JSON string with computed'.green, JSON.stringify(user, null, 3).magenta)

 
}
