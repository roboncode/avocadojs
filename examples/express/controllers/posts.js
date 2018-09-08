const orango = require('orango')
const app = require('../app')
const Post = orango.model('Post')

app.get('/posts', async (req, res) => {
  const posts = await Post.findMany()
  res.send(posts)
})

app.get('/posts/:id', async (req, res) => {
  const post = await Post.findOne({ _key: req.params.id })
  res.send(post)
})
