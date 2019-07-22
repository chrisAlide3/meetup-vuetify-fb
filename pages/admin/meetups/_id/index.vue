<template>
  <div>
    <h1>Edit meetup route</h1>
    <hr>
    <Form :meetup="meetup"/>
  </div>
</template>

<script>
import Form from '~/components/meetups/Form'

export default {
  components: {
    Form
  },
  computed: {
    meetup () {

    }
  }  
}
</script>
