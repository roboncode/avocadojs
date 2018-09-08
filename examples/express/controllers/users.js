const orango = require('orango')
const app = require('../app')
const User = orango.model('User')

app.get('/users', async (req, res) => {
  const users = await User.findMany()
    .computed(true)
    .select('firstName lastName')
  res.send(users)
})

app.get('/users/:id', async (req, res) => {
  const user = await User.findOne({ _key: req.params.id })
    .computed(true)
    .select('firstName lastName')
  res.send(user)
})
