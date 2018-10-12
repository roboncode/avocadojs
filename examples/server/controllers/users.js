const orango = require('orango')
const app = require('../app')
const Tweet = orango.model('Tweet')
const User = orango.model('User')
const CONSTS = orango.CONSTS

app.get('/users/:handle', async (req, res) => {
  try {
    const userProfile = await User
    .findOne({ screenName: req.params.handle })
    .select('_key screenName avatar settings firstName lastName stats created')
    .computed(true)
    .defaults(true)
    .id()
    if (userProfile) {
      res.status(200).send(userProfile)
    } else {
      res.status(404).send('Not found')
    }
  } catch (e) {
    res.status(500).send(e.message)
  }
})

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

Tweet.on(CONSTS.EVENTS.DELETED, async friend => {
  User.findByIdAndUpdate(result.data.user, {
    stats: { tweets: '--1' }
  }).exec()
})
