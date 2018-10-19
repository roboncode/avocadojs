<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-toolbar color="white" flat dense>
          <v-toolbar-title>Compose new chirp</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text">
          <v-textarea autofocus outline no-resize counter="140" label="What's happening?" v-model="text"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark depressed round @click="send">Chirp</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    dialog: false,
    text: ''
  }),
  methods: {
    ...mapActions('tweet', ['postTweet']),
    open() {
      this.dialog = true
    },
    close() {
      this.text = ''
      this.dialog = false
    },
    send() {
      this.postTweet(this.text)
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
