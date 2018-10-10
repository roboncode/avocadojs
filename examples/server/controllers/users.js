const orango = require('orango')
const Tweet = orango.model('Tweet')
const User = orango.model('User')
const CONSTS = orango.CONSTS

// Tweet.on('createdMany', async tweets => {
//   await asyncForEach(tweets, async friend => {
//     const tagCounters = await createTagCounter(friend.tags, 1)
//     await FriendGroup.findOneAndUpdate({ user: friend.user }, tagCounters, {
//       upsert: true
//     })
//   })
// })

Tweet.on(CONSTS.EVENTS.CREATED, result => {
  User.findByIdAndUpdate(result.data.user, {
    stats: { tweets: '++1' }
  }).exec()
})

Tweet.on('deleted', async friend => {
  User.findByIdAndUpdate(result.data.user, {
    stats: { tweets: '--1' }
  }).exec()
})
