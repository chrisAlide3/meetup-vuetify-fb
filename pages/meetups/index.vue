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
      <v-flex xs6 sm4 align-self-center>
        <Search />
      </v-flex>
      <v-flex xs6 sm4 text-xs-right class="mt-2">
        <Sort :sortButtons="sortButtons" :activeSort="activeSort" @onSortChange="changeSort"/>
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
import Sort from '@/components/global/Sort'

export default {
  components: {
    MeetupHorizontal,
    Search,
    Sort
  },
  data () {
    return {
      sortButtons: ['Date', 'Title', 'Location'],
      // activeSort: {
      //   name: '',
      //   order: '',
      // },
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
    },
    activeSort () {
      console.log('activeSort', this.$store.getters.meetupsSort)
      return this.$store.getters.meetupsSort
    },
    // sortedMeetups () {
    //   if (this.activeSort.name === '') {
    //     return this.meetups
    //   }

    //   let sortField = this.activeSort.name.toLowerCase()
    //   if (sortField === 'location') {
    //     sortField = 'location.name'
    //   }

    //   return this.meetups.sort( (a, b) => {
    //     return a.sortField - b.sortField
    //   })
    // }
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
    changeSort (buttonName) {
      console.log('changeSort', buttonName)
      if (buttonName === this.activeSort.name) {
        if (this.activeSort.order === 'asc') {
          this.$store.dispatch('setMeetupsSort', {name: buttonName, order: 'desc'})
        } else {
          this.$store.dispatch('setMeetupsSort', {name: buttonName, order: 'asc'})
        }
      } else {
        this.$store.dispatch('setMeetupsSort', {name: buttonName, order: 'asc'})
      }
      this.$store.dispatch('sortMeetups')
    }
  }
} 
</script>
