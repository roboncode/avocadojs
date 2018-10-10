<template>
  <v-card class="inputbox mb-2 pa-3">
    <v-layout align-center>
      <avatar size="48" class="avatar" :user="authUser"></avatar>
      <span class="title">What's happening?</span>
      <v-spacer></v-spacer>
      
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
  .avatar
    margin-right 15px
</style>

