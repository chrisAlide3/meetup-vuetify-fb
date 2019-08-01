<template>
  <v-container>
    <v-layout row xs12>
        <List :meetups="meetups" :isAdmin="true"/>
    </v-layout>
    <v-layout row xs12 justify-center class="mt-3">
      <v-btn @click="$router.push('/admin/meetups/new')" color="success">Add meetup</v-btn>
    </v-layout>   
  </v-container>
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
        return e.userId == this.user.id
      })
    }
  },
  middleware: ['checkAuth']
}
</script>
