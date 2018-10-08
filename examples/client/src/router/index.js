import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Users from '@/views/Users.vue'
import Post from '@/views/Post.vue'
import PostMaster from '@/views/post/Master.vue'
import PostDetails from '@/views/post/Details.vue'

Vue.use(Router)


export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/posts',
      name: 'post',
      component: Post,
      children: [{
          path: '',
          name: 'post-master',
          component: PostMaster
        },
        {
          path: ':id',
          name: 'post-details',
          component: PostDetails
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ '@/views/About.vue')
    }
  ]
})