<template>
  <div>
    <h1>
      Auth route
    </h1>

    <Login v-if="$route.query.isLogin === 'true'" />
    <Register v-else />
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
}
</script>
