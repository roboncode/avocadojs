<template>
  <v-app>
    <!-- Toolbar -->
    <v-toolbar app flat dense clipped-left color="toolbar" class="elevation-1">
      <logo class="clickable hidden-sm-and-down" @click.native="$router.push({name: 'home'})"></logo>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <toolbar-link></toolbar-link>
      <v-spacer></v-spacer>
      <Avatar :user="authUser"></Avatar>
      <v-btn round depressed color="primary" class="tweet-btn hidden-sm-and-down" @click="tweet()">
        Tweet
      </v-btn>
    </v-toolbar>

    <!-- Views -->
    <v-content>
      <transition name="slide">
        <!-- "key" forces refresh when accessing same component -->
        <router-view :key="$route.fullPath" />
      </transition>
    </v-content>

    <!-- Dialogs -->
    <TweetDialog ref="tweetDialog"></TweetDialog>
    <CommentDialog ref="commentDialog"></CommentDialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" bottom right multi-line>
      {{ snackbarText }}
      <v-btn color="primary" flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import bus from '@/helpers/bus'
import Avatar from '@/components/Avatar'
import Logo from '@/components/Logo'
import ToolbarLink from '@/components/ToolbarLink'
import TweetDialog from '@/components/TweetDialog'
import CommentDialog from '@/components/CommentDialog'

export default {
  name: 'App',
  components: {
    Avatar,
    CommentDialog,
    Logo,
    ToolbarLink,
    TweetDialog
  },
  data() {
    return {
      snackbar: false,
      snackbarText: 'Hello, world!'
    }
  },
  computed: {
    ...mapState('auth', ['accessToken', 'authUser']),
    showMenu() {
      return !!this.authUser
    },
    userInitial() {
      return this.authUser.firstName.substr(0, 1)
    }
  },
  watch: {
    authUser() {
      this.drawer = true
    }
  },
  methods: {
    ...mapActions('auth', ['getAuthUser']),
    tweet() {
      this.$refs.tweetDialog.open()
    },
    comment(tweet) {
      this.$refs.commentDialog.open(tweet)
    }
  },
  created() {
    bus.$on('tweet', () => {
      this.tweet()
    })

    bus.$on('comment', tweet => {
      this.comment(tweet)
    })  

    bus.$on('beyondScope', () => {
      this.snackbarText = 'This is beyond the scope of this demo.'
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