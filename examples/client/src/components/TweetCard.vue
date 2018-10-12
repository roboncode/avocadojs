<template>
  <v-card tile flat v-if="tweet" class="tweet-card">
    <v-card-title>
      <v-layout>
        <router-link :to="{name: 'tweets', params: {handle: tweet.user.screenName}}">
        <avatar size="48" class="avatar" :user="tweet.user"></avatar>
        </router-link>
        <div class="details">
          <router-link :to="{name: 'tweets', params: {handle: tweet.user.screenName}}" class="details">
            <span class="name">{{tweet.user.firstName}} {{tweet.user.lastName}}</span>
            <span class="screenname">{{tweet.user.screenName}}</span>
            <router-link :to="link" class="time">{{tweet.created | moment("YYYY MMM YYYY")}}</router-link>
          </router-link>
          <div>{{tweet.text}}</div>
        </div>
      </v-layout>
    </v-card-title>

    <v-card-actions color="primary">
      <v-btn v-if="tweet.likes" flat color="pink" @click="toggleLike">
        <v-icon>favorite</v-icon>
        {{tweet.stats.likes}}
      </v-btn>
      <v-btn v-else flat color="grey" @click="toggleLike">
        <v-icon>favorite_outline</v-icon>
        {{tweet.stats.likes}}
      </v-btn>

      <v-btn flat color="grey" @click="comment">
        <v-icon class="material-icons-outlined">comment</v-icon>
        {{tweet.stats.comments}}
      </v-btn>
    </v-card-actions>
    <v-divider></v-divider>
  </v-card>
</template>


<script>
import { mapActions } from 'vuex'
import Avatar from '@/components/Avatar'
import bus from '@/helpers/bus'

export default {
  components: {
    Avatar
  },
  props: ['tweet'],
  computed: {
    link() {
      return this.tweet.user.screenName + '/status/' + this.tweet.id
    }
  },
  methods: {
    ...mapActions('tweet', ['postComment', 'likeTweet', 'unlikeTweet']),
    toggleLike() {
      if(this.tweet.likes) {
        this.unlikeTweet(this.tweet)
      } else {
        this.likeTweet(this.tweet)
      }
    },
    comment() {
      bus.$emit('comment', this.tweet)
    }
  }
}
</script>

<style lang="stylus" scoped>
.v-card__title
  padding-bottom 8px

.v-card__actions
  padding-top 0
  padding-left 70px

.v-btn
  min-width 24px
  padding-left 8px
  padding-right 8px

.v-icon
  margin-right 10px

.avatar
  margin-right 10px

.details
  color #333

.name
  font-weight bold
  margin-right 5px

  &:hover
    color #1da1f2

.screenname
  color #657786

.screenname:before
  content '@'

.time
  color #657786
  margin-left 5px

.time:before
  content '\00b7'
  margin-right 5px
  font-weight bold
</style>
