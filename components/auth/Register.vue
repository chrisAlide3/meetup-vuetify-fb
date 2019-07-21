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
                v-model="formData.firstname"
                :rules="firstnameRules"
                label="Firstname"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.surname"
                :rules="surnameRules"
                label="Surname"
                required
              >
              </v-text-field>

              <v-btn
                raised
                color="primary"
                @click="onPickFile"
              >Upload image
              </v-btn>
              <input
                type="file"
                style="display: none"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked"
              >
              <v-layout row v-if="imgUrl">
              <img :src="imgUrl" height="150" >
              </v-layout>

              <v-text-field
                v-model="formData.email"
                :rules="emailRules"
                label="E-mail"
                required
              >
              </v-text-field>

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
                :loading="loading.includes('register')"
                :disabled="!valid || loading.includes('register')"
                color="success"
                @click="register"
              >
                Register
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

      firstnameRules: [
        v => !!v || 'Firstname is required',
      ],
      surnameRules: [
        v => !!v || 'Surname is required',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 8) || 'Password must have at least 8 characters'
      ],

      formData: {
        firstname: '',
        surname: '',
        image: null,
        email: '',
        password: ''
      },
      imgUrl: '',
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
      register () {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('loading', 'register')
          this.$emit('register', this.formData)
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
      },
      onPickFile () {
        this.$refs.fileInput.click()
      },
      onFilePicked (event) {
        if (!event.target.files[0]) {
          return
        }
        const files = event.target.files
        const filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Invalid file. File must have an image extension')
        }
        // convert picked file to baseUrl format to display preview of chosen file
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imgUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.formData.image = files[0]
      }
    }
  }
</script>
