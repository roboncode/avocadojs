import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Users from './views/Users.vue'
import User from './views/User.vue'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/users',
      name: 'users',
      component: User
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
