<template>
  <v-app dark>
    <Header />
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import Header from '@/components/global/Header'

export default {
  components: {
    Header
  }
}
</script>
