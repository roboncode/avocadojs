module.exports = async ({ orango }) => {
  const User = orango.model('User')
  const { append } = orango.funcs

  let query = User.find()
    .one()
    .let('numbers', append([1, 2, 3], [3, 4, 5], true))
    .return(orango.return.append('numbers'))

  // FOR DEMO ONLY - show the raw query data
  let queryData = JSON.stringify(query)
  console.log(queryData.green)

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // exec query
  let result = await query.exec()
  console.log(result)
}
