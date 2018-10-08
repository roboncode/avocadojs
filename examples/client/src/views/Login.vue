<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <div id="e3" style="max-width: 400px; margin: auto;" class="grey lighten-3">
          <v-toolbar color="#1da1f2" dark>
            <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
            <v-toolbar-title>
                BlueJay
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn> -->
          </v-toolbar>

          <v-card>
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field label="Username" hint="Type 'rob', 'jane' or 'john'" outline v-model="username"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field type="password" label="Password" outline hide-details v-model="password"></v-text-field>
                </v-flex>
                <v-flex x12>
                  <v-btn block depressed large color="success" @click="login({username, password})">Login</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </div>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      username: 'rob',
      password: 'password'
    }
  },
  computed: {
    ...mapState('auth', ['authUser'])
  },
  methods: {
    ...mapActions('auth', ['login'])
  },
  watch: {
    authUser() {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>
