module.exports = async ({ orango }) => {
  // get a reference to User model
  const User = orango.model('User')

  let data = {
    active: true,
    email: 'john@gmail.com',
    firstName: 'John',
    lastName: 'Smith',
    tags: ['developer', 'github'],
    settings: {
      online: true,
      custom: {
        avatar: 'http://avatar.com/john',
        primaryColor: '#FFCC00',
        secondaryColor: '#000000',
        backgroundImage: 'http://background.com/123'
      }
    },
    updated: Date.now()
  }

  // create query
  let user = User.fromJSON(data)
  console.log(user)
}
