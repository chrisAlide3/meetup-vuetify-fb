<template>
  <v-layout row justify-center>
    <v-flex xs12 sm8>
      <v-card>
        <v-container fluid>
          <v-layout
            row
            fill-height
            v-for="meetup in meetups"
            :key="meetup.title"
            class="mb-2"  
          >
              <v-flex xs5 sm4 md3>
                <v-layout column fill-height>
                  <v-img
                  :src="meetup.imgUrl"
                  height="120px"
                  >
                  <div class="caption red--text darken-2 font-weight-bold ml-2">{{ meetup.location }}</div>
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
                        @click="detail(meetup.id)"
                      >
                        <v-icon left light>arrow_forward</v-icon>
                      Detail 
                      </v-btn>

                      <v-btn v-if="isAdmin"
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
                <v-layout column fill-height justify-center>
                  <div class="text-xs-center">
                    <v-chip
                      small 
                      :color="getChipData(meetup.id)[0].color"
                      :text-color="getChipData(meetup.id)[0].textColor"
                    >
                    {{ getChipData(meetup.id)[0].text }}
                    </v-chip>
                  </div>
                </v-layout>
              </v-flex>
              
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  props: {
    isAdmin: {
      type: Boolean,
      required: false
    }
  },
  created () {
    for (let meetup of this.meetups) {
      this.chipData.push(this.setChipData({id: meetup.id, date: meetup.date, time: meetup.time}))
    }    
  },
  data () {
    return {
      chipData: []
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    },
    user () {
      return this.$store.getters.user
    },
    meetups () {
      if (this.isAdmin) {
        return this.$store.getters.meetups.filter(e => {
          return e.userId == this.user.id
        })
      } else {
        return this.$store.getters.meetups
      }
    }
  },
  methods: {
    detail (id) {
      this.$router.push('/meetups/' + id)
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

<style scoped>
.row {
  border-bottom: 0.5px solid lightgray;
  padding-bottom: 10px
}
</style>
