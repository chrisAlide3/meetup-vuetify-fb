<template>
  <v-container>
    <!-- Search bar -->
    <v-layout row justify-center>
      <v-flex xs12 sm8>
        <Search />
      </v-flex>
    </v-layout>

    <!-- Horizontal Card -->
    <v-layout row justify-center
      v-for="meetup in meetups"
      :key="meetup.title"
      class="mb-1">
      <v-flex xs12 sm8>
        <MeetupHorizontal :meetup="meetup" />
      </v-flex>
    </v-layout>

    <!-- Footer Buttons -->
    <v-layout row xs12 justify-center class="mt-3">
      <v-btn @click="$router.push('/admin/meetups/new')" color="success">Add meetup</v-btn>
    </v-layout>
   
  </v-container>
</template>

<script>
import MeetupHorizontal from '@/components/meetups/MeetupHorizontal'
import Search from '@/components/global/Search'

export default {
  components: {
    MeetupHorizontal,
    Search
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    searchString () {
      return this.$store.getters.searchString
    },
    meetups () {
      let meetupsFromUser = []
      if (this.$store.meetups.length > 0) {
        meetupsFromUser = this.$store.getters.meetups.filter(meetup => {
          return meetup.userId == this.user.id
        })
      } else {
        return meetupsFromUser
      } 

      if (this.searchString === '') {
        return meetupsFromUser
      } else {
        return meetupsFromUser.filter(meetup => {
          return meetup.title.toUpperCase().includes(this.searchString.toUpperCase())
        })
      }
    }
  },
  middleware: ['checkAuth']
}
</script>
