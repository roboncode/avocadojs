module.exports = async ({ orango }) => {
  // get a reference to User model
  const User = orango.model('User')

  // exec static method
  let rawData = await User.findById('eddie')
  console.log('rawData'.green, rawData)

  // convert data to model
  let user = User.fromJSON(rawData)
  console.log('modelData'.green, user)
}
