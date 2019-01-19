module.exports = async ({ orango }) => {
  // get a reference to User model
  const User = orango.model('User')

  // create query
  let query = User.import({
    firstName: true
  }).return(orango.return.one())

  // FOR DEMO ONLY - show the raw query data
  let queryData = JSON.stringify(query)
  console.log(queryData.green)

  // FOR DEMO ONLY - show the AQL
  try {
    let aql = await query.toAQL(true)
    console.log(aql.cyan)
  } catch(e) {
    console.log('Error Caught!'.red, e.message)
  }
}
