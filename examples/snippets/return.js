module.exports = async ({ orango }) => {
  const Model = orango.model()
  // const { append } = orango.funcs
  // const { countDistinct } = orango.funcs
  const { append, concatSeparator, currentUser, length, nth, zip } = orango.funcs
  
  // Here are some other things you can try...
  // let query = Model.return(append([1, 2, 3], [3, 4, 5], true))
  // let query = Model.return((countDistinct([1, 2, 3])))
  // let query = Model.return(nth(['foo', 'bar', 'baz'], 2))
  // let query = Model.return(dateNow())
  // let query = Model.return(zip( [ "name", "active", "hobbies" ], [ "some user", true, [ "swimming", "riding" ] ] ))

  let query = Model.return(concatSeparator(' ', 'User "', currentUser(), '" has', length(currentUser()), 'chars'))

  // You can also just do it as a string using orango's @{} expression tag
  // let query = Model.return(`@{CONCAT_SEPARATOR(' ','User "', CURRENT_USER() ,'" has', LENGTH(CURRENT_USER()), 'chars')}`)

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
