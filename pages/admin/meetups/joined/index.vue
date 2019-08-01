<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex xs12 sm8>
        <Search />
      </v-flex>
    </v-layout>

    <v-layout row xs12>
      <List :meetups="meetups" :isAdmin="true" />
    </v-layout>
    
    <v-layout row xs12 justify-center class="mt-3">
      <v-btn @click="$router.push('/meetups')" color="success">Join meetups</v-btn>
    </v-layout>   
  </v-container>
  </template>

<script>
import List from '@/components/meetups/List'
import Search from '@/components/global/Search'

export default {
  components: {
    List,
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
      const joinedMeetups = this.$store.getters.meetups.filter(e => {
        return this.user.registeredMeetups.includes(e.id)
      })

      if (this.searchString === '') {
        return joinedMeetups
      } else {
        return joinedMeetups.filter(meetup => {
          return meetup.title.toUpperCase().includes(this.searchString.toUpperCase())
        })
      }
    }
  },
  middleware: ['checkAuth']
}
</script>

