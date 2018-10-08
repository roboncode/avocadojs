import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import tweet from './tweet'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    tweet
  }
})
