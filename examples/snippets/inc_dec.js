module.exports = async ({ orango }) => {
  const Stats = orango.model('Stats')

  let val = 10

  let query = Stats.update({
    friends: `++${val}`,
    likes: `--${val}`
  }).byId('1')

  // FOR DEMO ONLY - show the AQL
  let aql = await query.toAQL(true)
  console.log(aql.cyan)

  // find first item in users collection
  let rawData = await query.exec()
  console.log('rawData'.green, rawData)

  // convert data to model
  let user = Stats.fromJSON(rawData)
  console.log('modelData'.green, user)
}
