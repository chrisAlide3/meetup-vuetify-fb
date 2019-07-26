<template>
  <div>
    <Detail :meetup="meetup" />
  </div>
</template>

<script>
import Detail from '@/components/meetups/Detail'
import { fireDb } from '@/plugins/firebase.js'

export default {
  components: {
    Detail
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
