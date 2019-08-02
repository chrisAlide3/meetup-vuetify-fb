<template>
  <ProfileForm :user="loadedUser" @saveProfile="saveProfile" />
</template>

<script>
import ProfileForm from '@/components/users/ProfileForm'
import { fireDb } from '@/plugins/firebase.js'

export default {
  components: {
    ProfileForm
  },
  created () {
  this.loadedUser = this.$store.getters.user
  },
  data () {
    return {
      loadedUser: {}
    }
  },
  methods: {
    saveProfile (payload) {
      this.$store.dispatch('updateProfile', payload)
        .then(() => {
          this.$store.dispatch('clearLoading')
          this.$router.push('/')
        })
    }
  },
  middleware: ['checkAuth']
}
</script>