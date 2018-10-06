const orango = require('orango')
const app = require('../app')
const User = orango.model('User')
const Post = orango.model('Post')

app.get('/users', async (req, res) => {
  const users = await User.findMany()
    .computed(true)
    .defaults(true)
    .select('firstName lastName')
  res.send(users)
})

app.get('/users/:id', async (req, res) => {
  const user = await User.findOne({ _key: req.params.id })
    .computed(true)
    .select('firstName lastName')
  res.send(user)
})


Post.on('inserted', function (payload) {
  User.findByIdAndUpdate(payload.data.user, {
    stats: {
      posts: '+=1'
    }
  }).exec()
})