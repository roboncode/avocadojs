const orango = require('orango')
const jwt = require('jsonwebtoken')
const checkJWT = require('express-jwt')
const app = require('../app')
const config = require('../config')
const Auth = orango.model('Auth')

app.post('/signup', async (req, res) => {
  try {
    const authUser = await Auth.signup(
      req.body.username,
      req.body.password,
      req.body.name
    )
    if (authUser) {
      const token = jwt.sign({
        id: authUser._key,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        role: authUser.role
      }, config.JWT_SECRET, {
        issuer: config.JWT_ISSUER,
        expiresIn: config.JWT_EXPIRES
      })
      return res.send({
        token
      })
    }
    return res.status(401).send('Unauthorized')
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.post('/login', async (req, res) => {
  try {
    const authUser = await Auth.login(
      req.body.username,
      req.body.password
    )
    if (authUser) {
      const token = jwt.sign({
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        role: authUser.role
      }, config.JWT_SECRET, {
        issuer: config.JWT_ISSUER,
        expiresIn: config.JWT_EXPIRES
      })
      return res.send({
        token
      })
    }
    return res.status(401).send('Unauthorized')
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.get('/me', checkJWT({
  secret: config.JWT_SECRET
}), async (req, res) => {
  try {
    const userProfile = await Auth.getUser(req.user.id, {
      defaults: true
    })
    if (userProfile) {
      res.status(200).send(userProfile)
    } else {
      res.status(404).send('Not found')
    }
  } catch (e) {
    res.status(500).send(e.message)
  }
})