<template>
  <div>
    <h1>Edit meetup route</h1>
    <hr>
    <Form :meetup="meetup"/>
  </div>
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
  }
}
</script>
