import axios from '@/helpers/axios'

export default {
  async getUser({
    commit
  }, handle) {
    let {
      data
    } = await axios.get('/users/' + handle)
    commit('setCurrentUser', data)
    return data
  },

  async clearFollowers({
    commit
  }) {
    commit('setFollowers', null)
  },

  async getFollowers({
    commit
  }, params) {
    let {
      data
    } = await axios.get('users/' + params.user + '/followers')
    commit('setFollowers', data)
  },

  async clearFollowing({
    commit
  }) {
    commit('setFollowing', null)
  },

  async getFollowing({
    commit
  }, params) {
    let {
      data
    } = await axios.get('users/' + params.user + '/following')
    for(let item of data) {
      item.following = true
    }
    commit('setFollowing', data)
  },
}