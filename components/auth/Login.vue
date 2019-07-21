<template>
  <v-container>
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
                  :disabled="!valid"
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
  data: () => ({
      showPassword: false,
      valid: true,

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
        console.log(this.$store.getters.error)
        return this.$store.getters.error
      }
    },

    methods: {
      login () {
        if (this.$refs.form.validate()) {
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
