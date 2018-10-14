<template>
  <v-card flat class="profile-card" v-if="authUser">
    <v-img v-if="authUser.settings.banner" :src="authUser.settings.banner" aspect-ratio="2.75"></v-img>
    <geo-pattern v-else :value="authUser.screenName"></geo-pattern>
    <v-layout column class="content">
      <avatar size="72" class="avatar" :user="authUser"></avatar>
      <router-link :to="{ name: 'tweets', params: { handle: authUser.screenName }}" class="link active">
        <div class="name">{{authUser.firstName}} {{authUser.lastName}}</div>
      </router-link>
      <router-link :to="{ name: 'tweets', params: { handle: authUser.screenName }}" class="link active">
        <div class="screenname">{{authUser.screenName}}</div>
      </router-link>
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
            <router-link :to="{ name: 'following', params: { handle: authUser.screenName }}" class="link">
              <div class="stats-title">Following</div>
              <div class="stats-count">{{authUser.stats.following}}</div>
            </router-link>
          </v-flex>
          <v-flex>
            <router-link :to="{ name: 'followers', params: { handle: authUser.screenName }}" class="link">
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
import GeoPattern from '@/components/GeoPattern'

export default {
  components: {
    Avatar,
    GeoPattern
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
    color #666
    font-weight bold
    font-size 20px

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