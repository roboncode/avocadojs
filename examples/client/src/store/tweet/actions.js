import axios from '@/helpers/axios'

export default {
  async getTweets({ commit }, params) {
    try {
      let { data } = await axios.get('/tweets', { params })
      commit('setTweets', data)
      return data
    } catch (e) {
    }
  },

  async postTweet({ commit, rootState }, text) {
    let { data } = await axios.post('/tweets', {
      text
    })
    data.user = rootState.auth.authUser
    commit('addNewTweet', data)
  },

  async postComment({ commit }, { tweet, text }) {
    await axios.post('/comments', {
      tweet: tweet.id,
      text
    })
    // data.user = rootState.auth.authUser
    commit('incStatsCount', {
      tweet,
      stat: 'comments'
    })
  },

  async likeTweet({ commit }, tweet) {
    await axios.post('/likes', { tweet: tweet.id, like: true })
    commit('setTweetLikes', {
      tweet,
      likes: true
    })
    commit('incStatsCount', {
      tweet,
      stat: 'likes'
    })
  },

  async unlikeTweet({ commit }, tweet) {
    await axios.post('/likes', { tweet: tweet.id, like: false })
    commit('setTweetLikes', {
      tweet,
      likes: false
    })
    commit('decStatsCount', {
      tweet,
      stat: 'likes'
    })
  },

  clearTweets({ commit }) {
    commit('setTweets', null)
  }
}
