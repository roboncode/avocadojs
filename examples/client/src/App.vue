<template>
  <v-app>
    <!-- Toolbar -->
    <v-toolbar app flat dense clipped-left color="toolbar" class="elevation-1">
      <logo class="hidden-sm-and-down"></logo>
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
        <router-view />
      </transition>
    </v-content>

    <!-- Dialogs -->
    <TweetDialog ref="tweetDialog"></TweetDialog>

  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import bus from '@/helpers/bus'
import Avatar from '@/components/Avatar'
import Logo from '@/components/Logo'
import ToolbarLink from '@/components/ToolbarLink'
import TweetDialog from '@/components/TweetDialog'

export default {
  name: 'App',
  components: {
    Avatar,
    Logo,
    ToolbarLink,
    TweetDialog
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
    }
  },
  created() {
    bus.$on('tweet', () => {
      this.tweet()
    })

    if (this.accessToken) {
      this.getAuthUser()
    }
  }
}
</script>

<style lang="stylus">
a {
  text-decoration none
}

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
</style>