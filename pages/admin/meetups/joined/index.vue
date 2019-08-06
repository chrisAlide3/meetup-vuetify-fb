<template>
  <v-container>
    <!-- Dialog to confirm unjoin Meetup -->
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="290">
        <template v-slot:activator="{ on }">
          <!-- <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
        </template>
        <v-card>
          <v-card-title class="headline">Unregister Meetup?</v-card-title>
          <v-card-text><span>Click AGREE to unregister meetup </span><span style="color:red">{{ dialogMeetup.meetupTitle }}</span> </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="dialog = false">Disagree</v-btn>
            <v-btn color="red darken-1" flat @click="leaveMeetup(dialogMeetup.meetupId)">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- Snackbar, displayed after unregister meetup -->
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
          @onMeetupDialog="meetupDialog"/>
      </v-flex>
    </v-layout>

    <!-- Footer Buttons -->
    <v-layout row xs12 justify-center class="mt-3">
      <v-btn @click="$router.push('/meetups')" color="success">Join meetups</v-btn>
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
      // Dialog Data
      dialog: false,
      dialogMeetup: {},
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    searchString () {
      return this.$store.getters.searchString
    },
    meetups () {
      const joinedMeetups = this.$store.getters.meetups.filter(e => {
        return this.user.registeredMeetups.includes(e.id)
      })

      if (this.searchString === '') {
        return joinedMeetups
      } else {
        return joinedMeetups.filter(meetup => {
          return meetup.title.toUpperCase().includes(this.searchString.toUpperCase())
        })
      }
    }
  },
  methods: {
    meetupDialog (meetup) {
      this.dialogMeetup = {
        meetupId: meetup.id,
        meetupTitle: meetup.title
      }
      this.dialog = true
    },
    leaveMeetup (id) {
      this.dialog = false
      const loadElement = ['leave', id]
      this.$store.dispatch('loading', loadElement)
      const payload = {
        idMeetup: id,
        idUser: this.user.id
      }

      this.$store.dispatch('removeMeetupFromUser', payload)
        .then(() => {
          this.$store.dispatch('clearLoading')
          this.text = 'Meetup ' + this.dialogMeetup.meetupTitle + ' unregistered!'
          this.snackbar = true
        })
    },
  },
  middleware: ['checkAuth']
}
</script>
