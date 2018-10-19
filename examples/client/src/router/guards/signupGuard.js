import store from '@/store'
import bus from '@/helpers/bus'

export default (to, from, next) => {
  if (from.name) {
    if (store.state.auth.authUser) {
      next()
    } else {
      next(false)
      bus.$emit('signup')
    }
  } else {
    next({
      name: 'login',
      params: {
        redirect_after_login: to.path
      }
    })
  }
}