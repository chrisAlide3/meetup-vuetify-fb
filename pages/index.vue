<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <h1 class="text-xs-center">
        Homepage
      </h1>
      <div class="text-xs-center">
        Carrousel
      </div>
      <div class="text-xs-center">
        Meetup description
      </div>
      <hr>
      <div class="text-xs-center">
        Website description
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore corrupti vitae quam blanditiis delectus natus eveniet soluta rerum, expedita accusantium odit velit cumque libero minus obcaecati ex ad eum vero!</p>
      </div>
      <div class="text-xs-center">
        <v-btn depressed small color="success">
          <v-icon small left>
            account_box
          </v-icon>
          <span>Login</span>
        </v-btn>
        <v-btn depressed small color="primary">
          <v-icon small left>
            perm_identity
          </v-icon>
          <span>Register</span>
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>

export default {

}
</script>
