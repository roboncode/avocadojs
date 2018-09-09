const orango = require('orango')
const app = require('../app')
const Post = orango.model('Post')
const User = orango.model('User')

app.get('/posts', async (req, res) => {
  const authorId = req.query.author
  if (authorId) {
    try {
      let posts = await Post.getPostsByAuthor(authorId)
      res.send(posts)
    } catch (e) {
      res.send('error: ' + e.message)
    }
  } else {
    const posts = await Post.findMany(req.query)
    .populate('user', User)
    res.send(posts)
  }
})

app.get('/posts/:id', async (req, res) => {
  try {
    let posts = await Post.getPostsByAuthor(req.params.id)
    res.send(posts)
  } catch (e) {
    res.send('error: ' + e.message)
  }
})
