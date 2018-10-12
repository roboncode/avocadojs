<template>
  <div class="profile">
    <profile-banner></profile-banner>
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ProfileBanner from '@/components/ProfileBanner'

export default {
  components: {
    ProfileBanner
  },
  methods: {
    ...mapActions('tweet', ['clearTweets'])
  },
  destroyed() {
    this.clearTweets()
  }
}
</script>

<style lang="stylus" scoped>
</style>