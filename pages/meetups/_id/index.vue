<template>
  <div>
    <MeetupVertical :meetup="meetup" />
  </div>
</template>

<script>
import MeetupVertical from '@/components/meetups/MeetupVertical'
import { fireDb } from '@/plugins/firebase.js'

export default {
  components: {
    MeetupVertical
  },
  asyncData (context) {
    return fireDb.collection("meetups").doc(context.params.id).get()
      .then(doc => {
        if (doc.exists) {
          return {
            meetup: {...doc.data(), id: doc.id}
          }
        } else {
          console.log('Meetup not found')
        }
      })
      .catch(err => {
        console.error('Error reading meetup')
      })
  }
}
</script>
