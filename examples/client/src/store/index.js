import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import tweet from './tweet'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    tweet
  }
})

store.subscribe(mutation => {
  switch (mutation.type) {
    case 'tweet/addNewTweet':
      store.dispatch('auth/incTweetCount')
      break
  }
})

export default store
