<template>
  <v-app>
    <!-- Toolbar -->
    <toolbar v-if="!$route.meta.hideToolbar"></toolbar>

    <!-- Views -->
    <v-content>
      <router-view v-if="$route.meta.hideToolbar" :key="$route.fullPath"></router-view>
      <transition v-else name="slide">
        <!-- "key" forces refresh when accessing same component -->
        <router-view></router-view>
      </transition>
    </v-content>

    <div>
      <!-- Dialogs -->
      <tweet-dialog ref="tweetDialog"></tweet-dialog>
      <comment-dialog ref="commentDialog"></comment-dialog>
      <signup-dialog ref="signupDialog"></signup-dialog>

      <!-- Snackbar -->
      <v-snackbar v-model="snackbar" bottom right>
        {{ snackbarText }}
        <v-btn color="primary" flat @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import bus from '@/helpers/bus'
import Avatar from '@/components/Avatar'
import Logo from '@/components/Logo'
import Toolbar from '@/components/Toolbar'
import TweetDialog from '@/components/TweetDialog'
import CommentDialog from '@/components/CommentDialog'
import SignupDialog from '@/components/SignupDialog'

export default {
  name: 'App',
  components: {
    Avatar,
    CommentDialog,
    Logo,
    SignupDialog,
    Toolbar,
    TweetDialog
  },
  props: ['noToolbar'],
  data() {
    return {
      snackbar: false,
      snackbarText: ''
    }
  },
  computed: {
    ...mapState('auth', ['accessToken']),
    transition() {
      return ''
    }
  },
  methods: {
    ...mapActions('auth', ['getAuthUser']),
    tweet() {
      this.$refs.tweetDialog.open()
    },
    comment(tweet) {
      this.$refs.commentDialog.open(tweet)
    },
    signup() {
      this.$refs.signupDialog.open()
    }
  },
  created() {
    bus.$on('tweet', () => {
      this.tweet()
    })

    bus.$on('comment', tweet => {
      this.comment(tweet)
    })

    bus.$on('signup', () => {
      this.signup()
    })

    bus.$on('notImplemented', () => {
      this.snackbarText = 'Not implemented.'
      this.snackbar = true
    })

    if (this.accessToken) {
      this.getAuthUser()
    }
  }
}
</script>

<style lang="stylus">
a
  text-decoration none

.v-content
  background #E6ECF0

.v-btn
  text-transform none

.v-dialog
  margin 0 !important
  // margin-top 5px !important

.v-dialog__content
  align-items flex-start !important

.v-toolbar__title
  color #1da1f2

.theme--light.v-text-field--outline .v-input__slot
  border-color #1976d2

.tweet-btn
  font-weight 800 !important

.slide-enter-active, .slide-leave-active
  transition-property opacity, transform
  transition-duration 0.25s
  // transform: translate(0, -2em);

.slide-enter-active
  transition-delay 0.25s

.slide-enter, .slide-leave-active
  opacity 0
  transform translate(0, -1em)

.clickable
  cursor pointer
</style>