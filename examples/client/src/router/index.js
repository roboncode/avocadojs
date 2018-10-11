import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import Followers from '@/views/Followers.vue'
import Following from '@/views/Following.vue'
import Tweets from '@/views/Tweets.vue'
import Likes from '@/views/Likes.vue'

import authGuard from './guards/authGuard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: authGuard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ '@/views/About.vue')
    },
    {
      path: '/:user',
      name: 'profile',
      component: Profile,
      children: [
        {
          path: '',
          name: 'tweets',
          component: Tweets
        },
        {
          path: 'following',
          name: 'following',
          component: Following
        },
        {
          path: 'followers',
          name: 'followers',
          component: Followers
        }
        ,
        {
          path: 'likes',
          name: 'likes',
          component: Likes
        }
      ]
    }
  ]
})
