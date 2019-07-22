<template>
  <div>
    <h1>Meetups route</h1>
    <List />
    <v-btn v-if="isLoggedIn">Add meetup</v-btn>
  </div>
</template>

<script>
import List from '@/components/meetups/List'

export default {
  components: {
    List
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    }
  }
}
</script>
