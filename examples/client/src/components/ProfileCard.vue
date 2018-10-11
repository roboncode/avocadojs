<template>
  <v-card flat class="profile-card" v-if="authUser">
    <v-img src="https://cdn.player.one/sites/player.one/files/2016/09/20/yodas-hut-star-wars-episode-8.jpeg" aspect-ratio="2.75"></v-img>
    <v-layout column class="content">
      <avatar size="72" class="avatar" :user="authUser"></avatar>
      <div class="name">{{authUser.firstName}} {{authUser.lastName}}</div>
      <div class="screenname">{{authUser.screenName}}</div>
    </v-layout>
    <v-card-text>
      <v-container grid-list-md text-xs-center pa-2>
        <v-layout row wrap>
          <v-flex>
            <router-link to="roboncode" class="link">
              <div class="stats-title">Tweets</div>
              <div class="stats-count">{{authUser.stats.tweets}}</div>
            </router-link>
          </v-flex>
          <v-flex>
            <router-link :to="{ name: 'following', params: { user: authUser.screenName }}" class="link">
              <div class="stats-title">Following</div>
              <div class="stats-count">{{authUser.stats.following}}</div>
            </router-link>
          </v-flex>
          <v-flex>
            <router-link :to="{ name: 'followers', params: { user: authUser.screenName }}" class="link">
              <div class="stats-title">Followers</div>
              <div class="stats-count">{{authUser.stats.followers}}</div>
            </router-link>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
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
    top -40px
    left 10px

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
    text-decoration none

  .link:hover
    .stats-title
      color #1DA1F2
</style>


