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

  async likeTweet({ commit }, tweet) {
    // await axios.post('/likes', { tweet: tweet.id })
    commit('incLike', { tweet, stat: 'likes' })
  },

  async unlikeTweet({ commit }, tweet) {
    // await axios.delete('/likes', { tweet: tweet.id })
    commit('incStatsCount', { tweet, stat: 'likes' })
  },

  clearTweets({ commit }) {
    commit('decStatsCount', null)
  }
}
