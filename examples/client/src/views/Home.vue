<template>
<v-container grid-list-md>
  <v-layout row>
    <v-flex sm4 hidden-sm-and-down>
      <profile-card v-sticky="{ zIndex: 10, stickyTop: 50}"></profile-card>
    </v-flex>
    <v-flex xs12 md7>
      <tweet-box v-sticky="{ zIndex: 10, stickyTop: 50}" @click.native="tweet"></tweet-box>
      <tweet-card v-for="(tweet, index) in tweets" :key="index" :tweet="tweet"></tweet-card>
      <v-layout pa-4>
        <v-btn color="primary" depressed block round @click="getTweets(tweets.length)">Load more</v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import bus from '@/helpers/bus'
import ProfileCard from '@/components/ProfileCard'
import TweetBox from '@/components/TweetBox'
import TweetCard from '@/components/TweetCard'
import VueSticky from 'vue-sticky'

export default {
  components: {
    ProfileCard,
    TweetBox,
    TweetCard,
  },
  directives: {
    sticky: VueSticky
  },
  computed: {
    ...mapState('tweet', ['tweets'])
  },
  methods: {
    ...mapActions('tweet', ['getTweets', 'clearTweets']),
    tweet() {
      bus.$emit('tweet')
    }
  },
  created() {
    this.getTweets()
  },
  destroyed() {
    this.clearTweets()
  }
}
</script>

