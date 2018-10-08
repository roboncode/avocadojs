import axios from '@/helpers/axios'

export default {
  login({ commit, dispatch }, credentials) {
    return axios.post('/login', credentials).then(({ data }) => {
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
