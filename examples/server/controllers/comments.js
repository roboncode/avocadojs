/**
 * This represents a basic REST implementation of a recomment using Orango.
 * The Comment model is in "strict" mode and will filter out all undeclared.
 */
const orango = require('orango')
const checkJWT = require('express-jwt')
const app = require('../app')
const config = require('../config')
const Comment = orango.model('Comment')

app.post('/comments', checkJWT({
  secret: config.JWT_SECRET
}), async (req, res) => {
  try {
    let comment = new Comment({
      user: req.user.id,
      tweet: req.body.tweet,
      text: req.body.text,
      created: Date.now()
    })
    await comment
      .save({
        returnNew: true
      })
      .id()
      .defaults(true)
    res.status(201).json(comment)
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})
