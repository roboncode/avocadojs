<template>
  <v-container grid-list-md fluid>
  <v-layout row>
    <v-flex xs12 md7 offset-md3>
      <tweet-card v-for="(tweet, index) in tweets" :key="index" :tweet="tweet"></tweet-card>
    </v-flex>
  </v-layout>
</v-container>
</template>


<script>
import { mapActions, mapState } from 'vuex'
import TweetCard from '@/components/TweetCard'

export default {
  components: {
    TweetCard
  },
  computed: {
    ...mapState('tweet', ['tweets'])
  },
  methods: {
    ...mapActions('tweet', ['clearTweets','getTweets'])
  },
  created() {
    this.clearTweets()
    this.getTweets()
  }
}
</script>