<template>
  <v-container>
    <v-layout row
      justify-center
    >
      <v-flex xs12 sm10>    
        <v-carousel interval="5000">
          <v-carousel-item v-for="(meetup,i) in meetups" :key="i"
            :src="meetup.imgUrl"
          >
            <h1 class="text-xs-center amber--text" :key="meetup.title">{{ meetup.location }}</h1>
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

    <v-layout row text-xs-center>
      <v-flex xs12 sm10>
        <v-btn v-if="!isLoggedIn"
            round
            depressed
            color="success"
            @click="$router.push('/auth/?isLogin=true')"
          >
            <v-icon small left>
              account_box
            </v-icon>
            <span>Login</span>
          </v-btn>

          <v-btn v-if="!isLoggedIn"
            round
            depressed
            color="primary"
            @click="$router.push('/auth/')"
          >
            <v-icon small left>
              perm_identity
            </v-icon>
            <span>Register</span>
          </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
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
