<template>
  <Form :meetup="meetup" @updateMeetup="updateMeetup"/>
</template>

<script>
import Form from '~/components/meetups/Form'
import { fireDb } from '~/plugins/firebase.js'

export default {
  components: {
    Form
  },
  asyncData (context) {
    const meetupId = context.params.id
    return fireDb.collection('meetups').doc(meetupId).get()
      .then(doc => {
        return {
          meetup: doc.data()
        }
      })
      .catch(err => {
        console.log('Error reading meetup')
      })
  },
  computed: {
    error () {
      return this.$store.getters.error
    }
  },
  methods: {
    updateMeetup (payload) {
      this.$store.dispatch('updateMeetup', payload)
        .then(() => {
          this.$store.dispatch('clearLoading')
          if (!this.error) {
            this.$router.push('/')
          } else {
            console.log('Meetup not updated')
          }
        })
    }
  },
  middleware: ['checkAuth']
}
</script>
