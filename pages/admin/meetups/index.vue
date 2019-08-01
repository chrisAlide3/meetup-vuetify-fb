<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex xs12 sm8>
        <Search />
      </v-flex>
    </v-layout>

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
      const meetupsFromUser = this.$store.getters.meetups.filter(meetup => {
        return meetup.userId == this.user.id
      })

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
