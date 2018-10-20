import axios from '@/helpers/axios'

export default {
  signup({commit, dispatch}, credentials) {
    return axios.post('/signup', credentials).then(({data}) => {
      commit('setAccessToken', data.accessToken)
      dispatch('getAuthUser')
    })
  },
  login({ commit, dispatch }, credentials) {
    return axios.post('/login', credentials).then(({ data }) => {
      commit('setAccessToken', data.accessToken)
      dispatch('getAuthUser')
    })
  },
  logout({commit}) {
    commit('clearAuthUser')
  },
  getAuthUser({ commit }) {
    return axios.get('/me').then(({ data }) => {
      commit('setAuthUser', data)
    })
  },
  incTweetCount({ commit }) {
    commit('incStatsCount', 'tweets')
  },
  incFollowingCount({ commit }) {
    commit('incStatsCount', 'following')
  },
  decFollowingCount({ commit }) {
    commit('decStatsCount', 'following')
  }
}
