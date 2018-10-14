import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import Followers from '@/views/Followers.vue'
import Following from '@/views/Following.vue'
import Tweets from '@/views/Tweets.vue'
import Likes from '@/views/Likes.vue'
import NotFound from '@/views/NotFound.vue'

import authGuard from './guards/authGuard'
import store from '@/store'
import bus from '@/helpers/bus'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
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
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import( /* webpackChunkName: "about" */ '@/views/About.vue')
    // },
    {
      path: '/:handle',
      name: 'profile',
      component: Profile,
      children: [{
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
        },
        {
          path: 'likes',
          name: 'likes',
          component: Likes
        }
      ]
    },
    {
      path: '/hashtag/:hashtag',
      name: 'hashtag',
      beforeEnter(to, from, next) {
        bus.$emit('notImplemented')
        next(false)
      }
    },
    {
      name: 'notFound',
      path: '/404',
      component: NotFound
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.params.handle) {
    if (to.params.handle !== from.params.handle) {
      try {
        await store.dispatch('user/getUser', to.params.handle)
      } catch (e) {
        return next({
          name: 'notFound'
        })
      }
    }
  }
  next()
})

export default router