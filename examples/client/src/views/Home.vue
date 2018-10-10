<template>
<v-container grid-list-md>
  <v-layout row>
    <v-flex sm3 hidden-sm-and-down>
      <profile-card></profile-card>
    </v-flex>
    <v-flex xs12 sm6>
      <input-box></input-box>
      <v-card tile flat v-for="tweet in tweets" :key="tweet.id">
        <v-card-title>
          <v-layout align-center>
            <v-avatar color="primary" size="24">
              <span class="white--text headline">J</span>
            </v-avatar>
            <h4>{{tweet.user.firstName}} {{tweet.user.lastName}}</h4>
            <v-spacer></v-spacer>
            <v-btn flat icon color="grey">
              <v-icon>favorite_outline</v-icon>
            </v-btn>
            <v-btn flat icon color="grey">
              <v-icon>comment</v-icon>
            </v-btn>
          </v-layout>
        </v-card-title>

        <v-card-text>
          <div>{{tweet.text}}</div>
        </v-card-text>

        <!-- <v-card-actions color="primary">
        </v-card-actions> -->
        <v-divider></v-divider>
      </v-card>
      <v-layout pa-4>
        <v-btn color="primary" depressed block round @click="getTweets(tweets.length)">Load more</v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import InputBox from '@/components/InputBox'
import ProfileCard from '@/components/ProfileCard'

export default {
  components: {
    InputBox,
    ProfileCard
  },
  computed: {
    ...mapState('tweet', ['tweets'])
  },
  methods: {
    ...mapActions('tweet', ['getTweets', 'clearTweets'])
  },
  created() {
    this.getTweets()
  },
  destroyed() {
    this.clearTweets()
  }
}
</script>

<style lang="stylus" scoped>
.v-avatar
  margin-right 10px

  span
    font-size 12px !important

.v-card__title
  background rgba(0, 0, 0, 0.02)
  padding-top 0
  padding-bottom 0px

.v-card__text
  // padding-top 6px
  // padding-bottom 0

.v-card__actions
  padding-top 0
</style>
