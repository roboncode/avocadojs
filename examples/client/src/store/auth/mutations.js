import axios from '@/helpers/axios'

export default {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    axios.defaults.headers.common = { Authorization: 'Bearer ' + accessToken }
    localStorage.setItem('app:token', accessToken)
  },
  setAuthUser(state, authUser) {
    state.authUser = authUser
  },
  incStatsCount(state, target) {
    state.authUser.stats[target]++
  },
  decStatsCount(state, target) {
    state.authUser.stats[target]--
  }
}
