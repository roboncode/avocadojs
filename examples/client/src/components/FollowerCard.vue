<template>
  <v-card flat class="profile-card" v-if="user" height="100%">
    <v-img v-if="user.settings.banner" :src="user.settings.banner" aspect-ratio="2.75" max-height="90" class="banner"></v-img>
    <v-responsive v-else aspect-ratio="2.75" max-height="90">
      <geo-pattern :value="user.screenName"></geo-pattern>
    </v-responsive>
    <v-layout class="content" align-center>
      <router-link :to="{name: 'tweets', params: {handle: user.screenName}}">
        <avatar size="70" class="avatar" :user="user"></avatar>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn class="following" round depressed small color="primary">
        <span class="up">Following</span>
        <span class="over">Unfollow</span>
      </v-btn>
      <v-btn icon>
        <v-icon class="more">more_vert</v-icon>
      </v-btn>
    </v-layout>
    <v-card-text>
      <div class="name">{{user.firstName}} {{user.lastName}}</div>
      <div class="screenname">{{user.screenName}}</div>
      <smart-text class="desc" :text="user.desc"></smart-text>
    </v-card-text>
  </v-card>
</template>

<script>
import Avatar from '@/components/Avatar'
import SmartText from '@/components/SmartText'
import GeoPattern from '@/components/GeoPattern'

export default {
  components: {
    Avatar,
    GeoPattern,
    SmartText
  },
  props: ['user']
}
</script>

<style lang="stylus" scoped>
.profile-card
  .v-card__text
    padding-top 0
    margin-top -9px

  .banner
    background-color #1da1f2

  .avatar
    position absolute
    top -40px
    left 10px

  .content
    position relative

  .name
    font-weight bold
    font-size 18px

  .name:hover
    text-decoration underline

  .screenname
    color #666
    font-size 15px
    margin-top -4px

  .screenname:hover
    text-decoration underline

  .screenname:before
    content '@'

  .link
    text-decoration none

  .link:hover
    .stats-title
      color #1DA1F2


  .over
    display none

  .following:hover
    background-color #b00020 !important

    .up
      display none
    .over
      display: inline-block

  .more
    color rgba(0, 0, 0, 0.3) !important
    
</style>


