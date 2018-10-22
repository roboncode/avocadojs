import Vue from 'vue'
import Router from 'vue-router'
import authGuard from './guards/authGuard'
import signupGuard from './guards/signupGuard'
import store from '@/store'
import bus from '@/helpers/bus'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'home',
      component: () => import( /* webpackChunkName: "home" */ '@/views/Home.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/login',
      name: 'login',
      component: () => import( /* webpackChunkName: "login" */ '@/views/Login.vue'),
      meta: {
        hideToolbar: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import( /* webpackChunkName: "signup" */ '@/views/Signup.vue'),
      meta: {
        hideToolbar: true
      }
    },
    {
      path: '/:handle',
      component: () => import( /* webpackChunkName: "profile" */ '@/views/Profile.vue'),
      children: [{
          path: '',
          name: 'tweets',
          component: () => import( /* webpackChunkName: "tweets" */ '@/views/Tweets.vue'),
          beforeEnter: authGuard
        },
        {
          path: 'following',
          name: 'following',
          component: () => import( /* webpackChunkName: "following" */ '@/views/Following.vue'),
          beforeEnter: signupGuard
        },
        {
          path: 'followers',
          name: 'followers',
          component: () => import( /* webpackChunkName: "followers" */ '@/views/Followers.vue'),
          beforeEnter: signupGuard
        },
        {
          path: 'likes',
          name: 'likes',
          component: () => import( /* webpackChunkName: "likes" */ '@/views/Likes.vue'),
          beforeEnter: signupGuard
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
      component: () => import( /* webpackChunkName: "notfound" */ '@/views/NotFound.vue'),
      meta: {
        hideToolbar: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.params.handle) {
    if (to.params.handle !== from.params.handle) {
      try {
        await store.dispatch('user/getUser', to.params.handle)
        const currentUser = store.state.user.currentUser
        document.title = currentUser.firstName + ' ' + currentUser.lastName + '(@' + currentUser.screenName + ') | Chirpy'
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