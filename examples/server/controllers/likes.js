/**
 * This represents a basic REST implementation of a relike using Orango.
 * The Like model is in "strict" mode and will filter out all undeclared.
 */
const orango = require('orango')
const app = require('../app')
const Tweet = orango.model('Tweet')

/**
 * Like tweet
 */
app.post('/likes', async (req, res) => {
  try {
    if (req.body.like) {
      Tweet.like(req.user.id, req.body.tweet)
    } else {
      Tweet.unlike(req.user.id, req.body.tweet)
    }
    res.status(201).send('Created')
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

/**
 * Unlike tweet
 */
// app.delete('/likes', async (req, res) => {
//   try {
//     Tweet.unlike(req.user.id, req.body.tweet)
//     res.status(200).send('Ok')
//   } catch (e) {
//     res.status(500).json({
//       error: e.message
//     })
//   }
// })

// /**
//  * Get likes
//  */
// app.get('/likes', async (req, res) => {
//   try {
//     const likes = await Like.getTweets(req.user.id, req.query.limit, req.query.offset)
//     res.send(likes)
//   } catch (e) {
//     res.status(500).send(e.message)
//   }
// })

// /**
//  * Get like
//  */
// app.get('/likes/:id', async (req, res) => {
//   try {
//     let like = Like.getTweet(req.params.id)
//     if (like) {
//       res.status(200).send(like)
//     } else {
//       res.status(404).send('Not found')
//     }
//   } catch (e) {
//     res.status(500).send(e)
//   }
// })

// /**
//  * Update like
//  */
// app.put('/likes/:id', async (req, res) => {
//   try {
//     let result = await Like.findOneAndUpdate({
//       id: req.params.id,
//       user: req.user.id
//     })
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
