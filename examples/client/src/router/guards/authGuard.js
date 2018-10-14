import store from '@/store'
import decodeJWT from 'jwt-decode'

const THRESHOLD = 18000 // 5 mins

export default (to, from, next) => {
  if (store.state.auth.accessToken) {
    const decodedToken = decodeJWT(store.state.auth.accessToken)
    const timeRemaining = decodedToken.exp - Math.round(Date.now() / 1000) - THRESHOLD
    if (timeRemaining > 0) {
      return next()
    }
  }
  next({ name: 'login' })
}
