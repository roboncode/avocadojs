/**
 * This represents a basic REST implementation of a resource using Orango.
 * The Post model is in "strict" mode and will filter out all undeclared.
 */
const orango = require('orango')
const app = require('../app')
const Post = orango.model('Post')
const User = orango.model('User')

/**
 * Create post
 */
app.post('/posts', async (req, res) => {
  try {
    let post = new Post(req.body)
    let doc = await post.save().id()
    res.status(201).json(doc)
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

/**
 * Update post
 */
app.put('/posts/:id', async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(req.params.id, req.body)
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
 * Delete post
 */
app.delete('/posts/:id', async (req, res) => {
  try {
    let result = await Post.findByIdAndDelete(req.params.id)
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
 * Get posts
 */
app.get('/posts', async (req, res) => {
  let query = {}
  let posts
  try {
    if (req.query.user) {
      // this is more optimized when we know that user is only one user and we know which user
      query.user = req.query.user
      posts = await Post.findMany(query, {
          noDefaults: false
        })
        .id()
        .limit(req.query.limit)
        .offset(req.query.offset)
        // declare a variable with a known document _key (id)
        .var('knownUser', User, req.query.user)
        // we then use that variable to populate the "user" property in posts (second parameter)
        .populate('user', 'knownUser', {
          id: true,
          select: '_key firstName lastName',
          computed: true,
          noDefaults: true
        })
      // .toAQL() // RESULTS in the statement below
      // LET user = DOCUMENT('users/rob')
      // FOR doc IN posts
      // FILTER (doc.`user` == "rob")
      // RETURN MERGE(doc, { user: KEEP(user, '_key', 'firstName', 'lastName') })
    } else {
      // we use this when the user could be one or more users, but we dont know which user
      posts = await Post.findMany(query, {
          noDefaults: false
        })
        .id()
        .limit(req.query.limit)
        .offset(req.query.offset)
        .populate('user', User, {
          // we are using the Model (as a lookup) in the 2nd param to auto populate
          id: true,
          select: '_key firstName lastName',
          computed: true,
          noDefaults: true
        })
      // .toAQL() // RESULTS in the statement below
      // FOR doc IN posts
      // LET user = DOCUMENT(CONCAT('users/', doc.user))
      // RETURN MERGE(doc, { user: KEEP(user, '_key', 'firstName', 'lastName') })
    }
    res.send(posts)
  } catch (e) {
    res.status(500).send(e)
  }
})

/**
 * Get post
 */
app.get('/posts/:id', async (req, res) => {
  try {
    let post = await Post.findById(req.params.id, {
        noDefaults: false
      })
      .id()
      .populate('user', User, {
        // we are using the var as the 2nd param in populate we declared above
        id: true,
        select: '_key firstName lastName',
        computed: true,
        noDefaults: true
      })
    if (post) {
      res.status(200).send(post)
    } else {
      res.status(404).send('Not found')
    }
  } catch (e) {
    res.status(500).send(e)
  }
})