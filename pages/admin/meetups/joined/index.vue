<template>
  <List :meetups="meetups" :isAdmin="true" />
</template>

<script>
import List from '@/components/meetups/List'

export default {
  components: {
    List
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    meetups () {
      return this.$store.getters.meetups.filter(e => {
        return this.user.registeredMeetups.includes(e.id)
      })
    }
  },
  middleware: ['checkAuth']
}
</script>

