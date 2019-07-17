<template>
  <div>
    <Login v-if="$route.query.isLogin === 'true'" @login="login" />
    <Register v-else @register="register" />
  </div>
</template>

<script>
import Login from '@/components/auth/Login'
import Register from '@/components/auth/Register'

export default {
  components: {
    Login,
    Register
  },
  methods: {
    register (formData) {
      this.$store.dispatch('register', formData)
        .then(data => {
          this.$router.go(-1)
        })
    },
    login (formData) {
      this.$store.dispatch('login', formData)
        .then(data => {
          this.$router.go(-1)
        })
    }
  }
}
</script>
