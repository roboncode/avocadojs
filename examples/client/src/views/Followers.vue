<template>
  <v-container grid-list-md fluid>
    <v-layout row>
      <v-flex offset-md1 md10>
        <v-layout row wrap>
          <v-flex lg4 sm6 xs12 v-for="(user, index) in followers" :key="index">
            <follower-card :user="user"></follower-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

  </v-container>
</template>


<script>
import { mapActions, mapState } from 'vuex'
import FollowerCard from '@/components/FollowerCard'

export default {
  components: {
    FollowerCard
  },
  computed: {
    ...mapState('user', ['currentUser']),
    ...mapState('user', ['followers'])
  },
  methods: {
    ...mapActions('user', ['clearFollowers', 'getFollowers'])
  },
  created() {
    this.clearFollowers()
    this.getFollowers({ user: this.currentUser.id })
  }
}
</script>