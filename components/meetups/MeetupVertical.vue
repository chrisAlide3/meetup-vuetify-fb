<template>
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
                <div class="title primary--text my-2">{{ meetup.location }}</div>
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
</template>

<script>
export default {
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
    }
  }
}
</script>
