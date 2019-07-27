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

              <v-flex xs7 sm8 md9>
                <v-layout column fill-height justify-space-between>                    
                    <div class="title ml-2 mt-1">{{ meetup.title }}</div>
                    <div class="subheading ml-2 grey--text font-weight-bold">{{ meetup.date | date }}</div>
                    <v-card-actions>
                      <v-btn
                        color="primary"
                        flat small
                        @click="detail(meetup.id)"
                      >
                        <v-icon left light>arrow_forward</v-icon>
                      Detail 
                      </v-btn>
                    </v-card-actions>
                </v-layout>
              </v-flex>
              
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import List from '@/components/meetups/List'

export default {
  components: {
    List
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    },
    meetups () {
      return this.$store.getters.meetups
    }
  },
  methods: {
    detail (id) {
      this.$router.push('/meetups/' + id)
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