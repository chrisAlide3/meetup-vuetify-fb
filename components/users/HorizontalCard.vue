<template>
  <v-container
      grid-list-lg

    >
    <v-layout row justify-center wrap>
        <!-- <v-flex>
          <v-card flat>
              <v-layout> -->
      <v-flex xs3 sm2>
        <v-avatar
          color="grey lighten-4"
        >
          <img :src="user.imgUrl">
        </v-avatar>
      </v-flex>
      <v-flex xs10>
        <v-card-title>
          <!-- <div> -->
            <div class="title">{{ user.firstname }} {{ user.surname }}</div>
          <!-- </div> -->
        </v-card-title>
      </v-flex>
    </v-layout>
          <!-- </v-card>
      </v-flex>
    </v-layout> -->
  </v-container>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
