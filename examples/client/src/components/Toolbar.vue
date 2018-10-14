<template>
  <v-toolbar v-if="!$route.meta.hideToolbar" app flat dense clipped-left color="toolbar" class="elevation-1">
    <logo class="clickable hidden-sm-and-down" @click.native="$router.push({name: 'home'})"></logo>
    <v-spacer class="hidden-sm-and-down"></v-spacer>
    <toolbar-link></toolbar-link>
    <v-spacer></v-spacer>
    <Avatar v-if="authUser" :user="authUser"></Avatar>
    <v-btn round depressed color="primary" class="tweet-btn hidden-sm-and-down" @click="tweet()">
      Chirp
    </v-btn>
    <v-btn v-if="!authUser" flat round>Have an account?&nbsp;<strong>Log in</strong></v-btn>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'
import bus from '@/helpers/bus'
import Avatar from '@/components/Avatar'
import ToolbarLink from '@/components/ToolbarLink'
import Logo from '@/components/Logo'

export default {
  components: {
    Avatar,
    ToolbarLink,
    Logo
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
  methods: {
    tweet() {
      bus.$emit('tweet')
    }
  }
}
</script>
