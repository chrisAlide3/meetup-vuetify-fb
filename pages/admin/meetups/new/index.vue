<template>
  <div>
    <h1>Add meetup route</h1>
    <hr>
    <Form @addMeetup="addMeetup" />
</div>
</template>

<script>
import Form from '~/components/meetups/Form'

export default {
  components: {
    Form
  },
  methods: {
    addMeetup (payload) {
      this.$store.dispatch('addMeetup', payload)
        .then(() => {
          this.$store.dispatch('clearLoading')
          if (!this.$store.getters.error) {
            this.$router.push('/')
          } else {
            console.log('Error on adding meetup')
          }
        })
    }
  }
}
</script>
