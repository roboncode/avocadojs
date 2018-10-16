<template>
  <div class="profile" :class="$vuetify.breakpoint.name">
    <profile-banner></profile-banner>
    <!-- "key" forces refresh when accessing same component -->
    <transition name="slide">
      <router-view class="view" :key="$route.fullPath" />
    </transition>
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
.lg, .md
  .view 
    padding-top 50px
</style>