<template>
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
    ></v-text-field>

    <v-text-field
      v-model="formData.email"
      :rules="emailRules"
      label="E-mail"
      required
      disabled
    >
    </v-text-field>

    <v-btn
      :disabled="!valid"
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
</template>

<script>
  export default {
    created () {
      if (this.user) {
        this.formData.firstname = this.user.firstname
        this.formData.surname = this.user.surname
        this.formData.email = this.user.email
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
        email: '',
      }
    }),
    props: {
      user: {
        type: Object,
        required: true
      }
    },
    methods: {
      saveProfile () {
        if (this.$refs.form.validate()) {
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
      }
    }
  }
</script>
