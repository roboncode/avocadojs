/**
 * This represents a basic REST implementation of a recomment using Orango.
 * The Comment model is in "strict" mode and will filter out all undeclared.
 */
const orango = require('orango')
const app = require('../app')
const Comment = orango.model('Comment')
const Like = orango.model('Like')
const CONSTS = orango.CONSTS

// /**
//  * Get comments
//  */
// app.get('/comments', async (req, res) => {
//   try {
//     const comments = await Comment.getComments(
//       req.user.id,
//       req.query.limit,
//       req.query.offset
//     )
//     res.send(comments)
//   } catch (e) {
//     res.status(500).send(e.message)
//   }
// })

// /**
//  * Get comment
//  */
// app.get('/comments/:id', async (req, res) => {
//   try {
//     let comment = Comment.getComment(req.params.id)
//     if (comment) {
//       res.status(200).send(comment)
//     } else {
//       res.status(404).send('Not found')
//     }
//   } catch (e) {
//     res.status(500).send(e)
//   }
// })

/**
 * Create comment
 */
app.post('/comments', async (req, res) => {
  try {
    let comment = new Comment({
      user: req.user.id,
      tweet: req.body.tweet,
      text: req.body.text,
      created: Date.now()
    })
    await comment
      .save({ returnNew: true })
      .id()
      .defaults(true)
    res.status(201).json(comment)
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

// /**
//  * Update comment
//  */
// app.put('/comments/:id', async (req, res) => {
//   try {
//     let result = await Comment.findOneAndUpdate({
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

// /**
//  * Delete comment
//  */
// app.delete('/comments/:id', async (req, res) => {
//   try {
//     let result = await Comment.findOneAndDelete({
//       id: req.params.id,
//       user: req.user.id
//     })
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

// Like.on(CONSTS.EVENTS.LINKED, ({ data }) => {
//   Comment.findByIdAndUpdate(data.to, {
//     stats: {
//       likes: '++1'
//     }
//   }).exec()
// })

// Like.on(CONSTS.EVENTS.UNLINKED, ({ data }) => {
//   Comment.findByIdAndUpdate(data.to, {
//     stats: {
//       likes: '--1'
//     }
//   }).exec()
// })
