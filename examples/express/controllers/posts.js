const orango = require('orango')
const app = require('../app')
const Post = orango.model('Post')
const User = orango.model('User')

app.get('/posts', async (req, res) => {
  const posts = await Post.findMany()
  res.send(posts)
})

app.get('/posts/:id', async (req, res) => {
  try {
    let posts = await Post.getPostsByAuthor(req.params.id)
    res.send(posts)
  } catch(e) {
    res.send('error: ' + e.message)
  }
})
