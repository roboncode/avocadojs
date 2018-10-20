const orango = require('orango')
const jwt = require('jsonwebtoken')
const app = require('../app')
const config = require('../config')
const Auth = orango.model('Auth')
const User = orango.model('User')

app.post('/signup', async (req, res) => {
  try {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    let authUser

    try {
      authUser = await Auth.signupByEmail(email, password)
    } catch (e) {
      return res.sendStatus(409)
    }

    if (authUser) {
      let user = await User.newUser(authUser.id, name, email)

      // console.log('#after', user)
      const accessToken = jwt.sign({
        id: authUser.id,
        role: user.role,
        permissions: user.permissions
      }, config.JWT_SECRET, {
        issuer: config.JWT_ISSUER,
        expiresIn: config.JWT_EXPIRES
      })

      const decodedJWT = jwt.decode(accessToken)

      return res.send({
        accessToken,
        expiresIn: decodedJWT.exp
      })
    }
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.post('/login', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const authUser = await Auth.login(email, password)

    if (authUser) {
      let user = await User.findByAuthId(authUser.id)

      const accessToken = jwt.sign({
        id: authUser.id,
        role: user.role,
        permissions: user.permissions
      }, config.JWT_SECRET, {
        issuer: config.JWT_ISSUER,
        expiresIn: config.JWT_EXPIRES
      })

      const decodedJWT = jwt.decode(accessToken)

      return res.send({
        accessToken,
        expiresIn: decodedJWT.exp
      })
    }

    // if (authUser) {
    //   const token = jwt.sign({
    //     id: authUser.id,
    //     email: authUser.email,
    //     firstName: authUser.firstName,
    //     lastName: authUser.lastName,
    //     role: authUser.role
    //   }, config.JWT_SECRET, {
    //     issuer: config.JWT_ISSUER,
    //     expiresIn: config.JWT_EXPIRES
    //   })
    //   return res.send({
    //     token
    //   })
    // }
    return res.status(401).send('Unauthorized')
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.get('/me', async (req, res) => {
  try {
    const userProfile = await User.findByAuthId(req.user.id, {
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