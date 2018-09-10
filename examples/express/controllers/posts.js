const orango = require('orango')
const app = require('../app')
const Post = orango.model('Post')
const User = orango.model('User')

app.get('/posts', async (req, res) => {
  let query = {}
  if (req.query.author) {
    query.user = req.query.author
  }
  try {
    let posts = await Post.findMany(query, { noDefaults: false })
      .limit(req.query.limit)
      .offset(req.query.offset)
      .populate('user', User, {
        select: 'firstName lastName',
        computed: true,
        noDefaults: true
      })
    res.send(posts)
  } catch (e) {
    res.send('error: ' + e.message)
  }
})

app.get('/posts/:id', async (req, res) => {
  
})
