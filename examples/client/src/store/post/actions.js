import axios from '@/helpers/axios'

export default {
  async getPosts({
    commit
  }) {
    let {
      data
    } = await axios.get('/posts')
    commit('setPosts', data)
  },
  getPost({
    commit
  }, {
    id
  }) {
    return axios.get(`/posts/${id}`).then(({
      data
    }) => {
      commit('setPost', data)
    })
  },
  createPost({
    commit
  }) {
    return axios.post(`/posts/`).then(({
      data
    }) => {
      commit('setPost', data)
    })
  },
  updatePost({
    commit
  }, {
    id,
    title,
    content
  }) {
    return axios.put(`/posts/${id}`, {
      title,
      content
    }).then(({
      data
    }) => {
      commit('setPost', data)
    })
  },
  deletePost({
    commit
  }, {
    id
  }) {
    return axios.delete(`/posts/${id}`).then(() => {
      commit('setPost', null)
    })
  },
  clearPosts({
    commit
  }) {
    commit('setPosts', null)
  },
  clearPost({
    commit
  }) {
    commit('setPost', null)
  }
}