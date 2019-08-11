<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex xs12 sm8 md6>
        <v-layout column>
          <v-card>
            <v-flex v-for="user in users" :key="user.id">
              <v-card>
                <UserHorizontalCard :user="user" />
              </v-card>
           </v-flex>
          </v-card>      
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import UserHorizontalCard from '@/components/users/HorizontalCard'
export default {
  components: {
    UserHorizontalCard
  },
  computed: {
    users () {
      return this.$store.getters.users
    }
  },
  middleware: ['checkAuth']
}
</script>
