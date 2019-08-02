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
        .then(() => {
          this.$store.dispatch('clearLoading')
          if (!this.$store.getters.error) {
            this.$router.push('/')
          }
        })
    },
    login (formData) {
      this.$store.dispatch('login', formData)
        .then(() => {
          this.$store.dispatch('clearLoading')
          if (!this.$store.getters.error) {
            const pushPath = this.$cookies.get('routeGuardPath')
            if (pushPath != undefined) {
              this.$cookies.remove('routeGuardPath')
              this.$router.push(pushPath)
            } else {
              this.$router.push('/')
            }
          }
        })
    }
  }
}
</script>
