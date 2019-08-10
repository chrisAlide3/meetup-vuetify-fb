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
      <v-flex xs12 sm8 align-self-center>
        <Search />
      </v-flex>
    </v-layout>

    <!-- Sort/filter bar -->
    <v-layout row justify-center>
      <v-flex xs12 sm8>
        <v-layout row justify-end>
          <v-flex xs12 sm6 text-xs-right>
            <Sort
              :sortButtons="sortButtons"
              :activeSort="activeSort"
              :sortBarStyle="'icon'" 
              @onSortChange="changeSort"/>
          </v-flex>
          <v-flex text-xs-right shrink>
            <MeetupFilter v-if="user" :items="filterItems" :activeFilter="activeFilter" @onFilterChange="filterMeetups"/>
          </v-flex>
        </v-layout>
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
import MeetupFilter from '@/components/global/Filter'

export default {
  components: {
    MeetupHorizontal,
    Search,
    Sort,
    MeetupFilter
  },
  data () {
    return {
      sortButtons: ['Date', 'Title'],
      filterItems: [
        { name: 'All', icon: 'filter_list' },
        { name:  'Joined', icon: 'add_location' },
        { name:  'Mine', icon: 'person_pin_circle' }
      ],
      activeFilter: 'All',
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
    user () {
      return this.$store.getters.user
    },
    meetups () {
      const meetups = this.$store.getters.meetups
      let displayMeetups = meetups
      // Filter meetups
      switch (this.activeFilter) {
        case 'Joined':
          if (this.user) {
            if (this.user.registeredMeetups.length > 0) {
              displayMeetups = meetups.filter(meetup => {
                return this.user.registeredMeetups.includes(meetup.id) 
              })
            } else {
              displayMeetups = []
              return displayMeetups
            }
          }
          break
        case 'Mine':
          if (this.user) {
            displayMeetups = meetups.filter(meetup => {
              return meetup.userId = this.user.id
            })
          }
          break
      }

      if (this.searchString === '') {
        return displayMeetups
      } else {
        return displayMeetups.filter(meetup => {
          return meetup.title.toUpperCase().includes(this.searchString.toUpperCase())
        })
      }
    },
    activeSort () {
      return this.$store.getters.meetupsSort
    },
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
      if (buttonName === this.activeSort.name) {
        this.$store.dispatch('setMeetupsSort', {name: buttonName, orderAsc: !this.activeSort.orderAsc, orderDesc: !this.activeSort.orderDesc})
      } else {
        this.$store.dispatch('setMeetupsSort', {name: buttonName, orderAsc: true, orderDesc: false})
      }
      this.$store.dispatch('sortMeetups')
    },
    filterMeetups (field) {
      this.activeFilter = field.name
    }
  }
} 
</script>
