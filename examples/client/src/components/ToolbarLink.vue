<template>
  <v-layout style="max-width:300px">
    <router-link to="roboncode">
      <v-layout class="toolbar-link active" align-center>
        <v-icon class="icon">home</v-icon>
        <div class="subheading hidden-sm-and-down">Home</div>
      </v-layout>
    </router-link>

    <router-link to="roboncode">
      <v-layout class="toolbar-link" align-center>
        <v-icon class="icon">search</v-icon>
        <div class="subheading hidden-sm-and-down">Search</div>
      </v-layout>
    </router-link>

    <router-link to="roboncode">
      <v-layout class="toolbar-link" align-center>
        <v-icon class="icon">explore</v-icon>
        <div class="subheading hidden-sm-and-down">Discover</div>
      </v-layout>
    </router-link>
  </v-layout>
</template>

<style lang="stylus" scoped>
.toolbar-link
  padding 10px 14px
  color #1da1f2
  border-bottom 3px solid transparent
  cursor pointer

  &.active
    cursor pointer
    border-bottom 3px solid #1da1f2

  .subheading
    font-weight bold

  .icon
    margin-right 5px
    color #1da1f2 !important
</style>

