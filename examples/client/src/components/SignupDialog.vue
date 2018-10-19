<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-toolbar color="white" flat dense>
          <v-toolbar-title>Signup</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!-- <v-card-text class="text"> -->
          <!-- <v-textarea autofocus outline no-resize counter="140" label="Your comment..." v-model="text"></v-textarea> -->
        <!-- </v-card-text> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark depressed round @click="send">Signup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>0

<script>
export default {
  data: () => ({
    tweet: null,
    dialog: false,
    text: ''
  }),
  methods: {
    open(tweet) {
      this.tweet = tweet
      this.dialog = true
    },
    close() {
      this.text = ''
      this.dialog = false
    },
    send() {
      this.postComment({
        tweet: this.tweet,
        text: this.text
      })
      this.close()
    }
  }
}
</script>

<style lang="stylus" scoped>
.text
  padding-top 0
  padding-bottom 0
</style>
