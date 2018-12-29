module.exports = async ({ orango }) => {
  const User = orango.model('User')
  console.log(`✅  Populated "${User.collectionName}" collection`.green)

  await User.import([
    {
      _key: 'eddie',
      active: true,
      firstName: 'Eddie',
      lastName: 'VanHalen',
      tags: ['guitar'],
      born: 'January 26, 1955'
    },
    {
      active: true,
      firstName: 'Steve',
      lastName: 'Vai',
      tags: ['guitar', 'vocals']
    },
    {
      active: false,
      firstName: 'Randy',
      lastName: 'Rhoads',
      tags: ['guitar']
    },
    {
      active: true,
      firstName: 'Alex',
      lastName: 'Lifeson',
      tags: ['guitar', 'vocals']
    },
    {
      active: true,
      firstName: 'Slash',
      tags: ['guitar']
    }
  ])
}
