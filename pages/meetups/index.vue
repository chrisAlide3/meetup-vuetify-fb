<template>
  <List :meetups="meetups" :isAdmin="false" />
</template>

<script>
import List from '@/components/meetups/List'

export default {
  components: {
    List
  },
  computed: {
    meetups () {
      return this.$store.getters.meetups
    }
  }
} 
</script>
