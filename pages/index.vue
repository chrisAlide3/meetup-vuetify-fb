<template>
  <div>
    <v-layout row xs12 sm10
      class="mb-3"
      justify-center
    >
      <v-flex shrink>
        <v-btn
        round
        class="secondary"
        @click="$router.push('/meetups')"  
        >
          <v-icon left>supervisor_account</v-icon>
        View meetups
        </v-btn>
      </v-flex>
      
      <v-flex shrink>
        <v-btn v-if="isLoggedIn"
        round
        class="secondary"
        @click="$router.push('/admin/meetups/new')"   
        >
          <v-icon left>group_add</v-icon>
        Add meetup
        </v-btn>
      </v-flex>
      
    </v-layout>

    <v-layout row
      justify-center
    >
      <v-flex xs12 sm10>    
        <v-carousel interval="5000"  height="350px">
          <v-carousel-item v-for="(meetup,i) in meetups" :key="i"
            :src="meetup.imgUrl"
          >
            <h1 class="text-xs-center red--text darken-2 font-weight-black" :key="meetup.title">{{ meetup.alternateLocation !== '' ?meetup.alternateLocation :meetup.location.locality }}</h1>
          </v-carousel-item>                        
        </v-carousel>
      </v-flex>
    </v-layout>

    <v-layout row justify-center>
      <v-flex xs12 sm10>
        <blockquote class="blockquote">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore corrupti vitae quam blanditiis delectus natus eveniet soluta rerum, expedita accusantium odit velit cumque libero minus obcaecati ex ad eum vero!
        </blockquote>
      </v-flex>
    </v-layout>

    <v-layout row xs12 sm10 justify-space-around>
      <v-flex shrink>
        <v-btn v-if="!isLoggedIn"
            round
            depressed
            color="primary"
            @click="$router.push('/auth/?isLogin=true')"
          >
            <v-icon left>
              exit_to_app
            </v-icon>
            <span>Login</span>
          </v-btn>
      </v-flex>

      <v-flex shrink>
        <v-btn v-if="!isLoggedIn"
            round
            depressed
            color="secondary"
            @click="$router.push('/auth/')"
          >
            <v-icon left>
              account_circle
            </v-icon>
            <span>Register</span>
          </v-btn>
      </v-flex>
          
    </v-layout>
  </div>
</template>

<script>

export default {
  computed: {
    meetups () {
      return this.$store.getters.meetups
    },
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    }
  }
}
</script>
