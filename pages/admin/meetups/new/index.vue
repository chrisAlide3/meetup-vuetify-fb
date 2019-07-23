<template>
  <div>
    <h1>Add meetup route</h1>
    <hr>
    <Form @addMeetup="addMeetup" @updateMeetup="updateMeetup" />
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
            console.log('Meetup added')
            this.$router.push('/')
          } else {
            console.log('Error on adding meetup')
          }
        })
    },
    updateMeetup (formData) {
      this.$store.dispatch('updateMeetup', payload)
        .then(() => {
          console.log('Meetup updated')
        })
    }
  }
}
</script>
