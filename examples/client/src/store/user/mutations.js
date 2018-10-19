export default {
  setCurrentUser(state, user) {
    state.currentUser = user
  },
  setFollowers(state, user) {
    state.followers = user
  },
  setFollowing(state, user) {
    state.following = user
  },
}
