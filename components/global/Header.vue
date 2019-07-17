<template>
  <nav>
    <!-- Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
    >
      <v-toolbar flat dark class="primary">
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Meetups
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider />

      <v-list dense class="pt-0">
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          router
          :to="item.route"
        >
          <v-list-tile-action router to="item.route">
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-toolbar app dark class="teal darken-1">

      <v-toolbar-side-icon
        class="hidden-sm-and-up"
        @click="drawer = !drawer"
      />

      <v-toolbar-title class="white--text">
        <nuxt-link to="/" tag="span" style="cursor: pointer">Meetups</nuxt-link>
      </v-toolbar-title>

      <v-spacer />

      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat 
          v-for="item in menuItems" :key="item.title"
          router
          :to="item.route"
        >
          <v-icon left>
            {{ item.icon }}
          </v-icon>
        {{ item.title }}
        </v-btn>
      </v-toolbar-items>

    </v-toolbar>

  </nav>
</template>

<script>
export default {
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    menuItems () {
      let menuItems = [
        { title: 'View Meetups', icon: 'supervisor_account', route: '/meetups' },
        { title: 'Login', icon: 'exit_to_app', route: '/auth?isLogin=true' },
        { title: 'Register', icon: 'account_circle', route: '/auth?isLogin=false' }
      ]
      if (this.$store.getters.isLoggedIn) {
        menuItems = [
          { title: 'View Meetups', icon: 'supervisor_account', route: '/meetups' },
          { title: 'Profile', icon: 'person', route: '/profile' }
        ]
      }
      return menuItems
    }
  },
  methods: {
    navTo() {

    }
  }
}
</script>
