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
        email: '',
        password: ''
      }
    }),

    methods: {
      register () {
        if (this.$refs.form.validate()) {
          this.$emit('register', this.formData)
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
