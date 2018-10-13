const orango = require('orango')
const app = require('../app')
const Tweet = orango.model('Tweet')
const User = orango.model('User')
const Follower = orango.model('Follower')
const CONSTS = orango.CONSTS

const USER_PROFILE_PROPS = '_key screenName avatar settings firstName lastName desc stats created'

app.get('/users/:handle', async (req, res) => {
  try {
    const userProfile = await User
    .findOne({ screenName: req.params.handle })
    .select(USER_PROFILE_PROPS)
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

/**
 * Get followers
 */
app.get('/users/:handle/followers', async (req, res) => {
  try {
    const limit = req.query.limit
    const offset = req.query.offset

    let followers = await User.findByEdge(Follower, req.params.handle)
    .id()
    .limit(limit)
    .offset(offset)
    .select(USER_PROFILE_PROPS)
    .computed(true)
    .defaults(true)
    // .each((item) => {
    //   item.screenName = '@' + item.screenName
    // })
    res.send(followers)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/users/:handle/following', async (req, res) => {
  try {
    let followers
    const limit = req.query.limit
    const offset = req.query.offset

    delete req.query.limit
    delete req.query.offset

    let users = await User.findByEdge(Follower, req.params.handle, {
      outbound: true
    })
    .id()
    .limit(limit)
    .offset(offset)
    .select(USER_PROFILE_PROPS)
    .computed(true)
    .defaults(true)
    // .toAQL()

    // followers = await Follower

    // we use this when the user could be one or more users, but we dont know which user
    // followers = await Follower.findMany(req.query)
    //   // .id()
    //   .defaults(true)
    //   .limit(limit)
    //   .offset(offset)
    //   .populate(
    //     'user',
    //     User.findById('@@parent.user').select(
    //       '_key screenName firstName lastName avatar'
    //     )
    //   )
    // .toAQL() // RESULTS in the statement below
    res.send(users)
  } catch (e) {
    res.status(500).send(e)
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
