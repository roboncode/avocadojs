<template>
  <v-app>
    <!-- Toolbar -->
    <v-toolbar app flat dense clipped-left color="toolbar" class="elevation-1">
      <Logo></Logo>
      <v-spacer></v-spacer>
      <toolbar-link></toolbar-link>
      <v-spacer></v-spacer>
      <Avatar :user="authUser"></Avatar>
      <v-btn round depressed color="primary" class="tweet-btn" @click="tweet()">
        Tweet
      </v-btn>
    </v-toolbar>

    <!-- Views -->
    <v-content>
      <router-view />
    </v-content>

    <!-- Dialogs -->
    <TweetDialog ref="tweetDialog"></TweetDialog>

  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
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
    if (this.accessToken) {
      this.getAuthUser()
    }
  }
}
</script>

<style lang="stylus">
.v-toolbar__title
  color #1da1f2

.theme--light.v-text-field--outline .v-input__slot
  border-color #1976d2

.tweet-btn
  font-weight 800 !important
</style>