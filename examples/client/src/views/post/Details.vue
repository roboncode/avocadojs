<template>
  <div class="details" v-if="post">
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-text-field label="Title" placeholder="Title" solo v-model="post.title"></v-text-field>
        <v-textarea solo auto-grow label="Content" v-model="post.content"></v-textarea>
        <v-btn color="primary">Save</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('post', ['post'])
  },
  methods: {
    ...mapActions('post', ['getPost', 'clearPost']),
    save() {}
  },
  created() {
    this.getPost(this.$route.params)
  },
  destroy() {
    this.clearPost()
  }
}
</script>
