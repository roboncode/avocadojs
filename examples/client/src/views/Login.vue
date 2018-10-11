<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <div id="e3" style="max-width: 400px; margin: auto;" class="grey lighten-3">
          <!-- <v-toolbar color="#1da1f2" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>
                BlueJay
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn>
          </v-toolbar> -->
          <v-alert v-model="showError" color="error" transition="slide-y-transition">
            The username and password you entered did not match our records. Please double-check and try again.
          </v-alert>
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
                  <v-btn block depressed large color="success" @click="signin({username, password})">Login</v-btn>
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
      password: 'password',
      showError: false
    }
  },
  computed: {
    ...mapState('auth', ['authUser'])
  },
  methods: {
    ...mapActions('auth', ['login']),
    async signin(credentials) {
      try {
        await this.login(credentials)
        this.$router.push({ name: 'home' })
      } catch (e) {
        this.showError = true
      }
    }
  }
}
</script>
