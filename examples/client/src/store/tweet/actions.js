import axios from '@/helpers/axios'

export default {
  async getTweets({ commit }, offset) {
    let { data } = await axios.get('/tweets', {
      params: { offset }
    })
    commit('setTweets', data)
    return data
  },

  async postTweet({ commit, rootState }, text) {
    let { data } = await axios.post('/tweets', { text })
    data.user = rootState.auth.authUser
    commit('addNewTweet', data)
  },

  clearTweets({ commit }) {
    commit('setTweets', null)
  }
}
