<template>
  <v-card>
    <v-container fluid>
      <v-layout
        row
        fill-height
        class="mb-2"  
      >
        <v-flex xs5 sm4 md3>
          <v-layout column fill-height>
            <v-img
            :src="meetup.imgUrl"
            height="120px"
            >
            <div class="caption red--text darken-2 font-weight-bold ml-2">{{ meetup.alternateLocation !== '' ?meetup.alternateLocation :meetup.location.locality }}</div>
            </v-img>
          </v-layout>
        </v-flex>

        <v-flex xs7 sm8 md7>
          <v-layout column fill-height justify-space-between>
            <div class="title ml-2 mt-1">{{ meetup.title }}</div>
            <div class="subheading ml-2 grey--text font-weight-bold">{{ meetup.date | date }} {{ meetup.time == null ?'' :'at '+meetup.time }}</div>
            <v-card-actions>
              <v-btn
                color="primary"
                flat small
                @click="$router.push('/meetups/' + meetup.id)"
              >
                <v-icon left light>arrow_forward</v-icon>
              Detail 
              </v-btn>
              <!-- Only if user loggedIn -->
              <template v-if="user">
                <!-- Join button only if not own meetup and not already joined and meetup not ended -->
                <v-btn v-if="meetup.userId !== user.id && !user.registeredMeetups.includes(meetup.id) && getChipData(meetup.id)[0].text != 'Ended' "
                  color="error"
                  flat small
                  :loading="loading.includes('join') && loading.includes(meetup.id)"
                  @click="joinMeetup(meetup.id)"
                >
                  <v-icon left light>add</v-icon>
                Join
                </v-btn>
              </template>
              <!--  -->
              <v-btn v-if="isLoggedIn && user.id === meetup.userId"
                color="success"
                flat small
                @click="$router.push('/admin/meetups/' + meetup.id)"
              >
                <v-icon left light>edit</v-icon>
              Edit
              </v-btn>
            </v-card-actions>
          </v-layout>
        </v-flex>

        <v-flex md2 hidden-sm-and-down>
          <v-layout column fill-height>
            <v-flex shrink justify-self-start class="text-xs-center">
              <!-- Only if user LoggedIn -->
              <template v-if="user">
                <v-btn
                  flat
                  icon
                  color="indigo"
                  class="mt-0"
                  :loading="loading.includes('leave') && loading.includes(meetup.id)"
                  :disabled="!user.registeredMeetups.includes(meetup.id)"
                  @click="meetupDialog({id: meetup.id, title: meetup.title})"  
                >
                  <v-icon>star</v-icon>
                </v-btn>
              </template>
              <!--  -->
            </v-flex>
            <v-flex shrink class="text-xs-center mt-3">
              <v-chip
                small 
                :color="getChipData(meetup.id)[0].color"
                :text-color="getChipData(meetup.id)[0].textColor"
              >
              {{ getChipData(meetup.id)[0].text }}
              </v-chip>
            </v-flex>
          </v-layout>
        </v-flex>
        
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    meetup: {
      type: Object,
      required: true
    },
  },
  created () {
    this.chipData.push(this.setChipData({id: this.meetup.id, date: this.meetup.date, time: this.meetup.time}))
  },
  data () {
    return {
      chipData: [],
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    },
    user () {
      return this.$store.getters.user
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    joinMeetup (id) {
      const payload = {
        idUser: this.user.id,
        idMeetup: id
      }
      const loadElement = ['join', id]
      this.$store.dispatch('loading', loadElement)
      this.$emit('onJoin', payload)
    },
    meetupDialog (meetup) {
      if (this.getChipData(meetup.id)[0].text === 'Ended') {
        return
      } else {
        this.$emit('onMeetupDialog', meetup)
      }
    },
    leaveMeetup (id) {
      this.dialog = false
      const loadElement = ['leave', id]
      this.$store.dispatch('loading', loadElement)
      const payload = {
        idMeetup: id,
        idUser: this.user.id
      }
      this.$emit('onLeaveMeetup', payload)
    },
    setChipData (meetup) {
      let chipData = {}

      const nowWithoutTime = new Date()
      nowWithoutTime.setHours('00')
      nowWithoutTime.setMinutes('00')
      nowWithoutTime.setSeconds('00')
      nowWithoutTime.setMilliseconds('00')

      const nowPlusOneDay = new Date(nowWithoutTime)
      nowPlusOneDay.setDate(nowPlusOneDay.getDate() + 1)

      const meetupDateWithoutTime = new Date(meetup.date)
      meetupDateWithoutTime.setHours('00')
      meetupDateWithoutTime.setMinutes('00')
      meetupDateWithoutTime.setSeconds('00')
      meetupDateWithoutTime.setMilliseconds('00')

      const now = new Date()
      const meetupDate = new Date(meetup.date)      
      // Set time on meetupDate
      if (meetup.time == null) {
        meetup.time = '00:00'
      }
      const hours_minutes = meetup.time.split(':')
      meetupDate.setHours(hours_minutes[0])
      meetupDate.setMinutes(hours_minutes[1])

      if (meetupDate < now) {
        return chipData = {
          id: meetup.id,
          color: 'error',
          text: 'Ended',
          textColor: 'white'
        }
        } else if (meetupDateWithoutTime.getTime() == nowWithoutTime.getTime()) {
          return chipData = {
            id: meetup.id,
            color: 'orange',
            text: 'Ends Today!',
            textColor: 'white' 
          }
        } else if (meetupDateWithoutTime.getTime() == nowPlusOneDay.getTime()) {
          return chipData = {
            id: meetup.id,
            color: 'yellow',
            text: 'Ends Soon!',
            textColor: 'grey'
          }
        } else {
          return chipData = {
            id: meetup.id,
            color: 'success',
            text: 'Open',
            textColor: 'white'
          }
        }
    },
    getChipData (id) {
      return this.chipData.filter(e => {
        return e.id == id
      })
    }
  }
}
</script>
