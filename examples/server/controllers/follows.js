/**
 * This represents a basic REST implementation of a refollower using Orango.
 * The Follower model is in "strict" mode and will filter out all undeclared.
 */
const orango = require('orango')
const app = require('../app')
const Follower = orango.model('Follower')
const User = orango.model('User')

/**
 * Get followers
 */
app.get('/followers', async (req, res) => {
  try {
    let followers
    const limit = req.query.limit
    const offset = req.query.offset

    delete req.query.limit
    delete req.query.offset

    let users = await User.findByEdge(Follower, 'rob')
    .id()
    // .limit(2)
    .select('_key screenName firstName')
    .intercept((item) => {
      console.log('item', item)
      item.abc = 123
      return item
    })
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

app.get('/following', async (req, res) => {
  try {
    let followers
    const limit = req.query.limit
    const offset = req.query.offset

    delete req.query.limit
    delete req.query.offset

    let users = await User.findByEdge(Follower, 'rob', {
      outbound: true
    })
    .select('screenName firstName')
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

// /**
//  * Create follower
//  */
// app.post('/followers', async (req, res) => {
//   try {
//     let follower = new Follower(req.body)
//     let doc = await follower.save().id()
//     res.status(201).json(doc)
//   } catch (e) {
//     res.status(500).json({
//       error: e.message
//     })
//   }
// })

// /**
//  * Update follower
//  */
// app.put('/followers/:id', async (req, res) => {
//   try {
//     let result = await Follower.findOneAndUpdate({ id: req.params.id, user: req.user.id })
//     if (result.modified) {
//       res.status(200).send('Ok')
//     } else {
//       res.status(404).send('Not found')
//     }
//   } catch (e) {
//     res.status(500).json({
//       error: e.message
//     })
//   }
// })

// /**
//  * Delete follower
//  */
// app.delete('/followers/:id', async (req, res) => {
//   try {
//     let result = await Follower.findOneAndDelete({ id: req.params.id, user: req.user.id })
//     if (result.deleted) {
//       res.status(200).send('Ok')
//     } else {
//       res.status(404).send('Not found')
//     }
//   } catch (e) {
//     res.status(500).json({
//       error: e.message
//     })
//   }
// })

// /**
//  * Get followers
//  */
// app.get('/followers', async (req, res) => {
//   try {
//     let followers
//     const limit = req.query.limit
//     const offset = req.query.offset

//     delete req.query.limit
//     delete req.query.offset

//     // followers = await Follower

//     // we use this when the user could be one or more users, but we dont know which user
//     // followers = await Follower.findMany(req.query)
//     //   // .id()
//     //   .defaults(true)
//     //   .limit(limit)
//     //   .offset(offset)
//     //   .populate(
//     //     'user',
//     //     User.findById('@@parent.user').select(
//     //       '_key screenName firstName lastName avatar'
//     //     )
//     //   )
//     // .toAQL() // RESULTS in the statement below
//     res.send(followers)
//   } catch (e) {
//     res.status(500).send(e)
//   }
// })

// /**
//  * Get follower
//  */
// app.get('/followers/:id', async (req, res) => {
//   try {
//     let follower = await Follower.findById(req.params.id).populate(
//       'user',
//       User.findById('@@parent.user').select(
//         '_key screenName firstName lastName avatar'
//       )
//     )
//     if (follower) {
//       res.status(200).send(follower)
//     } else {
//       res.status(404).send('Not found')
//     }
//   } catch (e) {
//     res.status(500).send(e)
//   }
// })
