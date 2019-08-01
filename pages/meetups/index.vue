<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex xs12 sm8>
        <Search />
      </v-flex>
    </v-layout>
    <v-layout row>
      <List :meetups="meetups" :isAdmin="false" />
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
    searchString () {
      return this.$store.getters.searchString
    },
    meetups () {
      if (this.searchString === '') {
        return this.$store.getters.meetups
      } else {
        return this.$store.getters.meetups.filter(meetup => {
          return meetup.title.toUpperCase().includes(this.searchString.toUpperCase())
        })
      }
    }
  }
} 
</script>
