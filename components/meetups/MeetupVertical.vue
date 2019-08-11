<template>
  <v-container>
    <!-- Dialog for Map -->
    <v-layout row justify-center v-if="showMap">
      <v-dialog v-model="mapDialog" max-width="800">
        <template v-slot:activator="{ on }">
        </template>
        <v-card>
          <v-card-text>
            <DisplayMap :coordinates="meetup.location.coordinates" :locationName="meetup.location.name"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-2" flat @click="mapDialog=false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- Dialog for Delete meetup -->
    <v-layout row justify-center>
      <v-dialog v-model="deleteDialog" max-width="500">
        <v-card>
          <v-card-title class="headline" text-xs-center>Confirm delete</v-card-title>
          <v-card-text>
            <div v-if="registeredUsers.length > 0">
              <v-divider></v-divider>
              <p class="title mt-4">These users have already joined this meetup!</p>
              <v-layout column>
                <v-flex v-for="user in registeredUsers" :key="user.id">
                  <UserHorizontalCard :user="user" />
                </v-flex>
              </v-layout>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" flat @click="deleteDialog=false">
              <v-icon left>cancel</v-icon>
            Cancel
            </v-btn>
            <v-btn color="red darken-2" flat @click="deleteMeetup">
              <v-icon left>delete</v-icon>
            Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- Card -->
    <v-layout row justify-center>
      <v-flex xs12 sm8 md6>
        <v-card>
          <v-img
            :src="meetup.imgUrl"
            aspect-ratio="2.75"
          ></v-img>

          <v-layout column align-center>
            <v-flex>
              <v-card-title primary-title class="text-xs-center">
                <div>
                  <h3 class="headline mb-0">{{ meetup.title }}</h3>
                  <div class="title primary--text my-2">{{ meetup.alternateLocation !== '' ?meetup.alternateLocation :meetup.location.name }}
                    <v-icon @click="showMapDialog" color="secondary">map</v-icon>
                  </div>
                  <div>{{ meetup.date | date }} at {{ meetup.time }}</div>
                </div>
              </v-card-title>
            </v-flex>

            <v-flex>
              <v-card-text>
                {{ meetup.description }}
              </v-card-text>
            </v-flex>

            <v-card-actions>
              <v-btn flat color="black" @click="$router.go(-1)">
                <v-icon left>cancel</v-icon>
                Cancel
              </v-btn>
              <template v-if="isLoggedIn">
                <v-btn v-if="user.id === meetup.userId" flat color="success" @click="$router.push('/admin/meetups/' + meetup.id)">
                  <v-icon left>edit</v-icon>
                  Edit
                </v-btn>
                <v-btn v-if="user.id === meetup.userId" flat color="error" @click="confirmDeleteMeetup">
                  <v-icon left>delete</v-icon>
                  Delete
                </v-btn>
              </template>
              <v-btn flat color="orange">
                <v-icon left>share</v-icon>
                Share
              </v-btn>
            </v-card-actions>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import DisplayMap from '~/components/global/DisplayMap'
import UserHorizontalCard from '@/components/users/HorizontalCard'

export default {
  components: {
    DisplayMap,
    UserHorizontalCard
  },
  data () {
    return {
      // MapDialog
      showMap: false,
      mapDialog: false,
      // DeleteDialog
      deleteDialog: false
    }
  },
  props: {
    meetup: {
      type: Object,
      required: true
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    },
    user () {
      return this.$store.getters.user
    },
    registeredUsers () {
      let users = this.$store.getters.users
      let joinedUsers = []
      if (users) {
        for (let user of users) {
          if (user.registeredMeetups.length > 0) {
            for (let meetup of user.registeredMeetups) {
              if (meetup === this.meetup.id) {
                joinedUsers.push(user)
                break
              }
            }
          }
        }
      }
      return joinedUsers
    }
  },
  methods: {
    showMapDialog () {
      this.mapDialog = true
      this.showMap = true
    },
    confirmDeleteMeetup () {
      this.deleteDialog = true
    },
    deleteMeetup () {
      if (this.meetup.imgName !== '') {
        this.$store.dispatch('deleteMeetupImage', this.meetup.imgName)
          .then(() => {
          })
      }
      if (this.registeredUsers.length > 0) {
        for (let user of this.registeredUsers) {
          this.$store.dispatch('removeMeetupFromUser', {idUser: user.id, idMeetup: this.meetup.id})
          .then(() => {
          })
        }
      }

      this.$store.dispatch('deleteMeetup', this.meetup.id)
        .then(() => {
          console.log('meetup deleted')
          this.deleteDialog = false
          this.$router.go(-1)
        })
    }
  }
}
</script>
