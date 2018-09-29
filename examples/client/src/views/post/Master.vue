<template>
  <div class="master">
    <v-layout>
      <v-flex xs12 sm10 offset-sm1>
        <v-card v-for="post in posts" :key="post.id" class="ma-3">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{post.title}}</h3>
              <div>{{post.content}}</div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn flat color="orange" @click="edit(post.id)">edit</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('post', ['posts'])
  },
  methods: {
    ...mapActions('post', ['getPosts']),
    edit(id) {
      this.$router.push({ name: 'post-details', params: { id } })
    }
  },
  created() {
    this.getPosts()
  }
}
</script>
