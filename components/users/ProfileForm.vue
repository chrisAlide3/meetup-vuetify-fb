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

              <v-layout row>
                <v-btn v-if="formData.imgName == ''"
                  raised
                  color="primary"
                  @click="onPickFile"
                >Upload image
                </v-btn>
                <v-btn v-if="!formData.imgName == ''"
                  raised
                  color="error"
                  :loading="loading.includes('removeUserImage')"
                  @click="onRemoveFile"
                >Remove image
                </v-btn>
                <input
                  type="file"
                  style="display: none"
                  ref="fileInput"
                  accept="image/*"
                  @change="onFilePicked"
                >
              </v-layout>
              <v-layout row v-if="formData.imgUrl">
                <img :src="formData.imgUrl" height="150" >
              </v-layout>

              <v-text-field
                v-model="formData.email"
                :rules="emailRules"
                label="E-mail"
                required
                disabled
              >
              </v-text-field>

              <v-btn
                :loading="loading.includes('profile')"
                :disabled="!valid || loading.includes('profile')"
                color="success"
                @click="saveProfile"
              >
                Save
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
      if (this.user) {
        this.formData.firstname = this.user.firstname
        this.formData.surname = this.user.surname
        this.formData.email = this.user.email
        this.formData.imgUrl = this.user.imgUrl
        this.formData.imgName = this.user.imgName
      }
    },
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
        imgUrl: '',
        imgName: '',
        image: null,
        email: '',
      }
    }),
    props: {
      user: {
        type: Object,
        required: true
      }
    },
    computed: {
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      saveProfile () {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('loading', 'profile')
          const payload = {
            userid: this.$route.params.id,
            formData: this.formData
          }
          this.$emit('saveProfile', payload)
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      cancel () {
        this.$router.go(-1)
      },
      onDismiss () {
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
          this.formData.imgUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.formData.image = files[0]
      },
      onRemoveFile () {
        const payload = {
          userid: this.user.id,
          imgName: this.formData.imgName
        }
        this.$store.dispatch('loading', 'removeUserImage')
        this.$store.dispatch('removeUserImage', payload)
          .then(() => {
            console.log('image deleted')
            this.formData.imgUrl = ''
            this.formData.imgName = ''
            this.formData.image = null
          })
      }
    }
  }
</script>
