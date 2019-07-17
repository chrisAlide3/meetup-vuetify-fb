<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="formData.firstname"
      label="Firstname"
      required
    ></v-text-field>

    <v-text-field
      v-model="formData.surname"
      label="Surname"
      required
    ></v-text-field>

    <v-text-field
      v-model="formData.email"
      label="E-mail"
      required
    ></v-text-field>

    <v-text-field
      v-model="formData.password"
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
      formData: {
        firstname: '',
        surname: '',
        email: '',
        password: ''
      }
    }),

    methods: {
      register () {
        this.$emit('register', this.formData)
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
