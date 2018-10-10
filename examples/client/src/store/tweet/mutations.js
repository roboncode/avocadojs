export default {
  setTweets(state, tweets) {
    if (tweets === null) {
      state.tweets.splice(0, state.tweets.length)
    } else {
      state.tweets = state.tweets.concat(tweets)
    }
  },
  addNewTweet(state, tweet) {
    state.tweets.splice(0, 0, tweet)
  },
  setTweetLikes(state, { tweet, likes }) {
    tweet.likes = likes
  },
  incStatsCount(state, { tweet, stat }) {
    tweet.stats[stat]++
  },
  decStatsCount(state, { tweet, stat }) {
    tweet.stats[stat]--
  }
}
