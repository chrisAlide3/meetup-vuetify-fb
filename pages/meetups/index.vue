<template>
  <v-container>
    <!-- Snackbar, displayed after Join -->
    <v-layout row justify-center>
      <v-flex xs12 sm8>
        <v-snackbar
          v-model="snackbar"
          :bottom="y === 'bottom'"
          :left="x === 'left'"
          :multi-line="mode === 'multi-line'"
          :right="x === 'right'"
          :timeout="timeout"
          :top="y === 'top'"
          :vertical="mode === 'vertical'"
        >
          {{ text }}
          <v-btn
            color="pink"
            flat
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>

    <!-- Search bar -->
    <v-layout row justify-center>
      <v-flex xs12 sm8>
        <Search />
      </v-flex>
    </v-layout>

    <!-- Horizontal Card -->
    <v-layout row justify-center
      v-for="meetup in meetups"
      :key="meetup.title"
      class="mb-1">
      <v-flex xs12 sm8>
        <MeetupHorizontal :meetup="meetup"
          @onJoin="joinMeetup"/>
      </v-flex>
    </v-layout>

  </v-container>  
</template>

<script>
import MeetupHorizontal from '@/components/meetups/MeetupHorizontal'
import Search from '@/components/global/Search'

export default {
  components: {
    MeetupHorizontal,
    Search
  },
  data () {
    return {
      // Snackbar Data
      snackbar: false,
      y: 'top',
      x: null,
      mode: '',
      timeout: 6000,
      text: '',
    }
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
  },
  methods: {
    joinMeetup (payload) {
      this.$store.dispatch('addMeetupToUser', payload)
        .then(() => {
          this.$store.dispatch('clearLoading')
          this.text = 'Meetup added to your joined list'
          this.snackbar = true
        })
    },
  }
} 
</script>
