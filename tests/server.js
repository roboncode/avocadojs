;(async () => {
  const database = require('./database')
  const queries = require('./database/queries')

  // database.collections.init()
  // setTimeout(() => {
    database.migrations.migrate()
  // }, 1000)

  // let friends = await queries.friend.getFriends('rob', 1, 1)
  // console.log('#friends', friends)

  // let user = await queries.user.getUser('rob')
  // console.log('#user', user)

  // let user = await queries.user.getUserByAuthId('8rNg2qTHq0aK1RVWT99Ygg6vgzB2')
  // console.log('#user', user)
  

  // let user = await queries.user.updateUser('rob', {
  //   // location: 'Highland, UT'
  //   stats: {
  //     friends: 2
  //   }
  // }, true)
  // console.log('#user', user)

  //   let user = await queries.user.updateUser('rob', {
  //   // location: 'Highland, UT'
  //   stats: {
  //     friends: stats.friends + 1
  //   }
  // }, true)
  // console.log('#user', user)


  // await queries.user.incStat('rob', 'followers')

})()
