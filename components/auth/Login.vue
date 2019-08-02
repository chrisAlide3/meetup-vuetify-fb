<template>
  <v-container>
    <!-- Snackbar if redirected from routeGuard -->
    <v-flex xs12 sm8>
      <v-snackbar
        v-model="snackbar"
        :bottom="y === 'bottom'"
        :left="x === 'left'"
        :multi-line="mode === 'multi-line'"
        :right="x === 'right'"
        :timeout="timeout"
        :top="y === 'top'"
        :vertical="mode === 'vertical'"
      >
        {{ text }}
        <v-btn
          color="pink"
          flat
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-flex>

    <v-layout row justify-center v-if="error">
      <v-flex xs12 sm6>
        <Alert :message="error.message" @dismissed='onDismissed' />        
      </v-flex>
    </v-layout>

    <v-layout row justify-center>
      <v-flex xs12 sm6>
        <v-card>
          <v-card-text>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-text-field
                  v-model="formData.email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="formData.password"
                  :rules="passwordRules"
                  :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                  :type="showPassword ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="showPassword = !showPassword"
                >
                </v-text-field>

                <v-btn
                  :loading="loading.includes('login')"
                  :disabled="!valid || loading.includes('login')"
                  color="success"
                  @click="login"
                >
                  Login
                </v-btn>

                <v-btn
                  color="error"
                  @click="reset"
                >
                  Reset Form
                </v-btn>

                <v-btn
                  @click="cancel"
                >
                  Cancel
                </v-btn>
              </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  
</template>

<script>
export default {
  created () {
    // Show snackbar if routeGuardPath cookie
    if (this.$cookies.get('routeGuardPath') != undefined) {
      this.text = 'You must be logged in to access this area!'
      this.snackbar = true
    }
  },
  data: () => ({
      showPassword: false,
      valid: true,
      // Snackbar Data
      snackbar: false,
      y: 'top',
      x: null,
      mode: '',
      timeout: 6000,
      text: '',

      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 8) || 'Password must have at least 8 characters'
      ],

      formData: {
        email: '',
        password: ''
      }
    }),

    computed: {
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },

    methods: {
      login () {
        if (this.$refs.form.validate()) {
          const loadElement = ['login']
          this.$store.dispatch('loading', loadElement)
          this.$emit('login', this.formData)
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      cancel () {
        this.$router.push('/')
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    }
}
</script>
