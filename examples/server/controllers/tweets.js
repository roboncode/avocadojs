/**
 * This represents a basic REST implementation of a retweet using Orango.
 * The Tweet model is in "strict" mode and will filter out all undeclared.
 */
const orango = require('orango')
const app = require('../app')
const Tweet = orango.model('Tweet')
const User = orango.model('User')

/**
 * Create tweet
 */
app.post('/tweets', async (req, res) => {
  try {
    let tweet = new Tweet(req.body)
    let doc = await tweet.save().id()
    res.status(201).json(doc)
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

/**
 * Update tweet
 */
app.put('/tweets/:id', async (req, res) => {
  try {
    let result = await Tweet.findOneAndUpdate({ id: req.params.id, user: req.user.id })
    if (result.modified) {
      res.status(200).send('Ok')
    } else {
      res.status(404).send('Not found')
    }
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

/**
 * Delete tweet
 */
app.delete('/tweets/:id', async (req, res) => {
  try {
    let result = await Tweet.findOneAndDelete({ id: req.params.id, user: req.user.id })
    if (result.deleted) {
      res.status(200).send('Ok')
    } else {
      res.status(404).send('Not found')
    }
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

/**
 * Get tweets
 */
app.get('/tweets', async (req, res) => {
  try {
    let tweets
    const limit = req.query.limit
    const offset = req.query.offset

    delete req.query.limit
    delete req.query.offset

    // we use this when the user could be one or more users, but we dont know which user
    tweets = await Tweet.findMany(req.query)
      // .id()
      .defaults(true)
      .limit(limit)
      .offset(offset)
      .populate(
        'user',
        User.findById('@@parent.user').select(
          '_key screenName firstName lastName avatar'
        )
      )
    // .toAQL() // RESULTS in the statement below
    res.send(tweets)
  } catch (e) {
    res.status(500).send(e)
  }
})

/**
 * Get tweet
 */
app.get('/tweets/:id', async (req, res) => {
  try {
    let tweet = await Tweet.findById(req.params.id).populate(
      'user',
      User.findById('@@parent.user').select(
        '_key screenName firstName lastName avatar'
      )
    )
    if (tweet) {
      res.status(200).send(tweet)
    } else {
      res.status(404).send('Not found')
    }
  } catch (e) {
    res.status(500).send(e)
  }
})
