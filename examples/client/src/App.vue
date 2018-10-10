<template>
  <v-app>
    <!-- <v-navigation-drawer persistent :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" enable-resize-watcher fixed app>
      <v-list>
        <v-list-tile value="true" v-for="(item, i) in items" :key="i">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer> -->
    <v-toolbar app :clipped-left="clipped">
      <!-- <v-toolbar-side-icon v-if="authUser" @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>web</v-icon>
      </v-btn> -->
      <Logo></Logo>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar v-if="authUser" color="primary" size="36">
        <img v-if="authUser.avatar" :src="authUser.avatar" :alt="authUser.firstName">
        <span v-else class="white--text headline">{{userInitial}}</span>
      </v-avatar>
      <v-btn round depressed color="primary" @click="tweet()">
        Tweet
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
    <v-navigation-drawer temporary :right="right" v-model="rightDrawer" fixed app>
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!-- <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer> -->

    <TweetDialog ref="tweetDialog"></TweetDialog>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Logo from '@/components/Logo'
import TweetDialog from '@/components/TweetDialog'

export default {
  name: 'App',
  components: {
    Logo,
    TweetDialog
  },
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'bubble_chart',
          title: 'Inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Bluebird'
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
.theme--light.v-text-field--outline .v-input__slot
  border-color #1976d2
</style>