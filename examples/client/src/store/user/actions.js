import axios from '@/helpers/axios'

export default {
  async getUser({ commit }, handle) {
    let { data } = await axios.get('/users/' + handle)
    commit('setCurrentUser', data)
  }
}
