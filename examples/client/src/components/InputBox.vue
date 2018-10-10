<template>
  <v-card class="inputbox mb-2 pa-3">
    <v-layout align-center>
      <avatar size="48" class="avatar" :user="authUser"></avatar>
      <v-layout class="box pa-3">
        <span class="title">What's happening?</span>
        <v-spacer></v-spacer>
        <v-icon color="primary">image</v-icon>
      </v-layout>
    </v-layout>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import Avatar from '@/components/Avatar'

export default {
  components: {
    Avatar
  },
  computed: {
    ...mapState('auth', ['authUser'])
  }
}
</script>

<style lang="stylus" scoped>
.inputbox
  // background #e8f5fd !important

  .title
    opacity 0.5

  .avatar
    margin-right 15px

  .box
    background white
</style>

