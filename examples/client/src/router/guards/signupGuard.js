import store from '@/store'
import bus from '@/helpers/bus'
import authGuard  from './authGuard'

export default (to, from, next) => {
  if (from.name) {
    if (store.state.auth.authUser) {
      next()
    } else {
      next(false)
      bus.$emit('signup')
    }
  } else {
    authGuard(to, from, next)
  }
}