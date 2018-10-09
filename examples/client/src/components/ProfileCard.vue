<template>
  <v-card flat class="profile-card">
    <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg" aspect-ratio="2.75"></v-img>
    <avatar size="72" class="avatar" :user="authUser"></avatar>
    <v-layout column class="content">
      <div class="name">{{authUser.firstName}} {{authUser.lastName}}</div>
      <div class="screenname">{{authUser.screenName}}</div>
    </v-layout>
    <v-card-content>
      <v-container grid-list-md text-xs-center pa-2>
        <v-layout row wrap>
          <v-flex>
            <router-link to="roboncode" class="link">
              <div class="stats-title">Tweets</div>
              <div class="stats-count">{{authUser.stats.tweets}}</div>
            </router-link>
          </v-flex>
          <v-flex>
            <router-link to="following" class="link">
              <div class="stats-title">Following</div>
              <div class="stats-count">{{authUser.stats.following}}</div>
            </router-link>
          </v-flex>
          <v-flex>
            <router-link to="followers" class="link">
              <div class="stats-title">Followers</div>
              <div class="stats-count">{{authUser.stats.followers}}</div>
            </router-link>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-content>
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
.profile-card
  .avatar
    position absolute
    top 60px
    left 10px

  .content
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
    text-decoration none

  .link:hover
    .stats-title
      color #1DA1F2
</style>


