const orango = require('orango')
const jwt = require('jsonwebtoken')
const app = require('../app')
const User = orango.model('User')
const UserRole = orango.model('UserRole')

app.post('/id_token', async (req, res) => {
  const {
    id,
    email,
    firstName,
    lastName,
    role,
    permissions
  } = await User.findById(req.body.id)
    .populate(
      'permissions',
      UserRole.findById('@@parent.role || "user"').select('permissions'),
      {
        merge: true
      }
    )
    .id()
    .select('_key email firstName lastName role')
  const token = jwt.sign(
    {
      id,
      email,
      firstName,
      lastName,
      role,
      permissions
    },
    'secret'
  )
  res.send(token)
})

app.get('/me', async (req, res) => {
  res.send(req.user)
})
