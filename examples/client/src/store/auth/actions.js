import axios from '@/helpers/axios'

export default {
  login({ commit, dispatch }, credentials) {
    return axios.post('/login', credentials).then(({ data }) => {
      commit('setAccessToken', data.token)
      dispatch('getAuthUser')
    })
  },
  logout({commit}) {
    commit('setAccessToken', null)
    commit('setAuthUser', null)
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
