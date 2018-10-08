import axios from '@/helpers/axios'
// import parseUrl from '@/helpers/parseUrl'

export default {
  login({ commit, dispatch }, credentials) {
    return axios.post('/login', credentials).then(({ data }) => {
      axios.defaults.headers.common = {'Authorization': "Bearer " + data.token}
      commit('setAccessToken', data.token)
      dispatch('getAuthUser')
    })
  },
  getAuthUser({ commit }) {
    return axios.get('/me').then(({ data }) => {
      commit('setAuthUser', data)
    })
  }
}
