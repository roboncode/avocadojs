<template>
  <v-container class="login" grid-list-md fluid fill-height>
    <v-layout row justify-center align-center>
      <v-flex md4 hidden-sm-and-down>
        <v-img src="/img/mobile-phones.png" max-width="454"></v-img>
      </v-flex>
      <v-flex sm6 md4>
        <v-container fluid grid-list-md>
          <img width="50" src="@/assets/logo.png" alt="">
          <v-layout row wrap>
            <div class="declare">See what’s happening in the world right now</div>
            <v-flex xs12>
              <v-text-field label="email" outline hide-details v-model="email"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <!-- <v-text-field type="password" label="Password" outline hide-details v-model="password"></v-text-field> -->
              <v-text-field outline hide-details :append-icon="showPassword ? 'visibility_off' : 'visibility'" :rules="[rules.required, rules.min]" :type="showPassword ? 'text' : 'password'" label="Password" hint="At least 8 characters" v-model="password" @click:append="showPassword = !showPassword"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn block depressed large round color="success" @click="_login({email, password})">Log in</v-btn>
            </v-flex>
            <v-flex xs12>
              <v-btn width="200" round outline large dark block color="primary" :to="{name: 'signup'}">Sign Up</v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-center justify-center pt-3>
            <v-img src="/img/download-apple.png" max-width="140" @click="download"></v-img>
            <v-img src="/img/download-google.png" max-width="140" @click="download"></v-img>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import bus from '@/helpers/bus'

export default {
  data() {
    return {
      email: 'rob@chirpy.com',
      password: 'password',
      showError: false,
      showPassword: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => "The email and password you entered don't match"
      }
    }
  },
  computed: {
    ...mapState('auth', ['authUser'])
  },
  methods: {
    ...mapActions('auth', ['login']),
    async _login(credentials) {
      try {
        await this.login(credentials)
        if (this.$route.query.redirect_after_login) {
          this.$router.push(this.$route.query.redirect_after_login)
        } else {
          this.$router.push({ name: 'home' })
        }
      } catch (e) {
        this.showError = true
      }
    },
    download() {
      bus.$emit('notImplemented')
    }
  }
}
</script>

<style lang="stylus" scoped>
.login
  background white !important
  // background linear-gradient(
  // to right,
  // #1da1f2 0%,
  // #1da1f2 50%,
  // #ffffff 50%,
  // #ffffff 100%
  // )

.declare
  font-size 32px
  font-weight bold
  line-height 32px
  margin-bottom 18px
</style>

