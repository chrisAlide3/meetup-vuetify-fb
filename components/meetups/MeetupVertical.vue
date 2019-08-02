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
                <div class="caption grey--text lighten-1">{{ meetup.location }}</div>
              </div>
            </v-card-title>
          </v-flex>

          <v-flex>
            <v-card-text>
              {{ meetup.description }}
            </v-card-text>
          </v-flex>

          <v-card-actions>
            <v-btn flat color="orange">Share</v-btn>
            <v-btn flat color="orange">Explore</v-btn>
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
}
</script>
