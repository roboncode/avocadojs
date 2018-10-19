<template>
  <v-layout style="max-width:300px">
    <router-link :to="{name: 'home'}">
      <v-layout class="toolbar-link" align-center>
        <v-icon class="icon">home</v-icon>
        <div class="subheading hidden-sm-and-down">Home</div>
      </v-layout>
    </router-link>

    <span @click="notImplemented">
      <v-layout class="toolbar-link" align-center>
        <v-icon class="icon">search</v-icon>
        <div class="subheading hidden-sm-and-down">Search</div>
      </v-layout>
    </span>

    <span @click="notImplemented">
      <v-layout class="toolbar-link" align-center>
        <v-icon class="icon">explore</v-icon>
        <div class="subheading hidden-sm-and-down">Discover</div>
      </v-layout>
    </span>
  </v-layout>
</template>

<script>
import bus from '@/helpers/bus'
export default {
  methods: {
    notImplemented() {
      bus.$emit('notImplemented')
    }
  }
}
</script>


<style lang="stylus" scoped>
.toolbar-link
  padding 10px 14px
  color #1da1f2
  border-bottom 3px solid transparent
  cursor pointer

  .subheading
    font-weight bold

  .icon
    margin-right 5px
    color #1da1f2 !important

.router-link-exact-active
  .toolbar-link
    cursor pointer
    border-bottom 3px solid #1da1f2
</style>

