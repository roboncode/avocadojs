<template>
  <v-container class="signup" grid-list-md fluid fill-height>
    <v-layout row justify-center align-center>
      <v-flex sm6 md4>
        <v-layout align-center justify-center pa-4>
          <img width="72" src="@/assets/logo.png" alt="">
        </v-layout>
        <v-card>
          <v-container fluid grid-list-md>
            <v-layout justify-center pa-3>
              <h3>Sign up with Chirpy today!</h3>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="Name" outline :rules="[rules.required]" v-model="name"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email" outline :rules="[rules.required, rules.email]" v-model="email"></v-text-field>
              </v-flex>
              <v-flex x12>
                <v-text-field outline :append-icon="showPassword1 ? 'visibility_off' : 'visibility'" :rules="[rules.required, rules.min]" :type="showPassword1 ? 'text' : 'password'" label="Password" hint="At least 8 characters" v-model="password" @click:append="showPassword1 = !showPassword1"></v-text-field>
              </v-flex>
              <!-- <v-flex x12>
                <v-text-field outline :append-icon="showPassword2 ? 'visibility_off' : 'visibility'" 
                :rules="[rules.required, rules.min, rules.passwordMatch]" :type="showPassword2 ? 'text' : 'password'" 
                label="Type password again" hint="At least 8 characters" v-model="password2"
                @click:append="showPassword2 = !showPassword2"></v-text-field>
              </v-flex> -->
            </v-layout>
            <v-layout pa-2 text-xs-center>
              By signing up, you agree to eat a chocolate chip cookie today.
            </v-layout>
            <v-btn block depressed large round color="success" @click="_signup">Signup</v-btn>
          </v-container>
        </v-card>
        <div class="pa-3">
          <v-btn width="200" round outline large dark block color="primary" :to="{name: 'login'}">Got an account? Login</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password2: '',
      showError: false,
      showPassword1: false,
      showPassword2: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        email: value => {
          if (value.length > 0) {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Please type a valid email.'
          }
          return true
        }
        //emailMatch: () => "The email and password you entered don't match"
        // passwordMatch: () => this.password === this.password2 || 'Passwords must match'
      }
    }
  },
  computed: {
    ...mapState('auth', ['authUser'])
  },
  methods: {
    ...mapActions('auth', ['signup']),
    async _signup() {
      try {
        await this.signup({
          name: this.name,
          email: this.email,
          password: this.password
        })
        this.$router.push({ name: 'home' })
      } catch (e) {
        this.showError = true
      }
    }
  }
}
</script>
