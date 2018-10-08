const orango = require('orango')
const jwt = require('jsonwebtoken')
const app = require('../app')
const config = require('../config')
const Auth = orango.model('Auth')
const User = orango.model('User')

app.post('/login', async (req, res) => {
  try {
    const authUser = await Auth.login(req.body.username, req.body.password)
    if (authUser) {
      const token = jwt.sign(authUser, config.JWT_SECRET)
      return res.send({ token })
    }
    return res.status(401).send('Unauthorized')
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.get('/me', async (req, res) => {
  try {
    const userProfile = await Auth.getUser(req.user.id)
    if (userProfile) {
      res.status(200).send(userProfile)
    } else {
      res.status(404).send('Not found')
    }
  } catch (e) {
    res.status(500).send(e.message)
  }
})
