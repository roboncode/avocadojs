<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card tile v-for="tweet in tweets" :key="tweet.id">
        <v-card-title>
          <v-layout align-center>
            <v-avatar color="primary" size="24">
              <span class="white--text headline">J</span>
            </v-avatar>
            <h4>{{tweet.user.fullName}}</h4>
            <v-spacer></v-spacer>
          <v-btn flat icon color="pink">
            <v-icon>favorite</v-icon>
          </v-btn>
          <v-btn flat icon color="pink">
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
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('tweet', ['tweets'])
  },
  methods: {
    ...mapActions('tweet', ['getTweets'])
  },
  created() {
    this.getTweets()
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
