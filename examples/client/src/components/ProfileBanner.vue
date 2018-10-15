<template>
  <v-card class="profile-card" v-if="currentUser">
    <div class="background">
      <!-- <v-responsive :aspect-ratio="3.75" max-height="300" class="banner"> -->
      <!-- <v-parallax :src="currentUser.settings.banner" height="300"></v-parallax> -->
      <!-- </v-responsive> -->
      <v-img v-if="currentUser.settings.banner" :src="currentUser.settings.banner" aspect-ratio="3.75" max-height="285"></v-img>
      <v-responsive v-else :aspect-ratio="3.75" class="banner" max-height="285">
        <geo-pattern :value="currentUser.screenName"></geo-pattern>
      </v-responsive>
      <avatar size="148" font-size="big" class="avatar centered hidden-md-and-up hidden-xs-only" :user="currentUser"></avatar>
      <avatar size="70" class="avatar centered hidden-sm-and-up" :user="currentUser"></avatar>

      <v-btn color="white" fab small class="edit-btn hidden-md-and-up">
        <v-icon>edit</v-icon>
      </v-btn>
    </div>
    <v-layout column class="content hidden-sm-and-down">
      <avatar size="148" font-size="big" class="avatar" :user="currentUser"></avatar>
    </v-layout>
    <v-layout row>
      <v-spacer></v-spacer>
      <router-link :to="{ name: 'tweets' }" class="link">
        <div class="stats-title">Chirps</div>
        <div class="stats-count">{{currentUser.stats.tweets}}</div>
      </router-link>
      <router-link :to="{ name: 'following' }" class="link">
        <div class="stats-title">Following</div>
        <div class="stats-count">{{currentUser.stats.following}}</div>
      </router-link>
      <router-link :to="{ name: 'followers' }" class="link">
        <div class="stats-title">Followers</div>
        <div class="stats-count">{{currentUser.stats.followers}}</div>
      </router-link>
      <router-link :to="{ name: 'likes' }" class="link">
        <div class="stats-title">Likes</div>
        <div class="stats-count">{{currentUser.stats.likes}}</div>
      </router-link>
      <v-spacer></v-spacer>

      <v-btn round outline class="hidden-sm-and-down">Edit profile</v-btn>

    </v-layout>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import Avatar from '@/components/Avatar'
import GeoPattern from '@/components/GeoPattern'

export default {
  components: {
    Avatar,
    GeoPattern
  },
  computed: {
    ...mapState('user', ['currentUser'])
  }
}
</script>

<style lang="stylus" scoped>
.profile-card
  width 100%

  .banner
    overflow hidden

  .background
    position relative
    overflow hidden

  .avatar
    position absolute
    top -74px
    left 40px

  .avatar.centered
    top 50%
    left 50%
    transform translate(-50%, -50%)

  .edit-btn
    position absolute
    top 40%
    right 10px
    transform translateY(-50%)

  .content
    position relative
    padding-top 4px
    padding-left 100px

  .name
    font-weight bold
    font-size 20px

  .screenname
    font-size 15px
    margin-top -4px

  .screenname:before
    content '@'

  .stats-title
    color #657786
    font-weight bold
    font-size 14px

  .stats-count
    color #1DA1F2
    font-size 18px
    font-weight bold

  .link
    min-width 85px
    text-align center
    text-decoration none

  .router-link-exact-active
    border-bottom 3px solid #1DA1F2

  .link:hover
    .stats-title
      color #1DA1F2
</style>
