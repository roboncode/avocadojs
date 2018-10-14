<template>
  <v-container grid-list-md fluid fill-height>
    <v-layout row justify-center align-center>
      <v-flex md4 hidden-sm-and-down>
        <v-img src="/img/mobile-phones.png" max-width="454"></v-img>
      </v-flex>
      <v-flex sm6 md4>
        <v-layout align-center justify-center pa-4>
          <img width="72" src="@/assets/logo.png" alt="">
        </v-layout>
        <v-card flat>
          <v-container fluid grid-list-md>
            <v-layout justify-center pa-3>
              <h3>Sign up with Chirpy today!</h3>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="Username" outline hide-details v-model="username"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field type="password" label="Password" outline hide-details v-model="password"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout pa-2 text-xs-center>
              By signing up, you agree to our Terms, Data Policy and Cookies Policy.
            </v-layout>
          </v-container>
          <v-btn block depressed large color="success" @click="signin({username, password})">Login</v-btn>
        </v-card>
        <v-card class="mt-4" flat>
          <v-card-text>
            <v-layout justify-center>
              Need an account? <router-link :to="{name: 'signup'}">Sign up</router-link>
            </v-layout>
          </v-card-text>
        </v-card>
        <v-container grid-list-md fluid wrap>
          <v-layout row wrap align-center justify-center>
            <v-img src="/img/download-apple.png" max-width="140"></v-img>
            <v-img src="/img/download-google.png" max-width="140"></v-img>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
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
