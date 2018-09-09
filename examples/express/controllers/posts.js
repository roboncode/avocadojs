const orango = require('orango')
const app = require('../app')
const Post = orango.model('Post')
const User = orango.model('User')

app.get('/posts', async (req, res) => {
  const posts = await Post.findMany()
  res.send(posts)
})

app.get('/posts/:id', async (req, res) => {
  let result = await Post.findByQuery(
    `FOR user IN @@User
        FILTER user._key == '${req.params.id}'
          FOR post IN @@Post
            FILTER post.user == user._key`,

    { noDefaults: false }
  )
    .return('MERGE(post, { user: KEEP(user, "firstName", "lastName") })')
    .intercept(async doc => {
      doc.user = await new User(doc.user).toObject({
        noDefaults: true,
        computed: true
      })
      return doc
    })
  // .toAQL()

  res.send(result)
})
