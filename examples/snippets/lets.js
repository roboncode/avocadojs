module.exports = async ({ orango }) => {
  const User = orango.model('User')

  let query = User.find()
    .one()
    .let('num', 1)
    .let('str', 'Hello')
    .let('bool', true)
    .let('arr', [1, 'two', true])
    .let('obj', { foo: 'bar' })
    .return(
      orango.return
        .append('num', 'num1')
        .append('bool')
        .append('arr')
        .merge('obj')
    )

  // FOR DEMO ONLY - show the raw query data
  let queryData = JSON.stringify(query)
  console.log(queryData.green)

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)
}
