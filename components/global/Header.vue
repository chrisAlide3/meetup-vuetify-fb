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
          exact
        >
          <v-list-tile-action>
            <v-avatar class="mr-2" v-if="item.avatar && avatar"
            size="36px"
          >
            <img
              v-if="user.imgUrl"
              :src="user.imgUrl"
              alt="Avatar"
            >
          </v-avatar>
            <v-icon v-if="!item.avatar || item.avatar && !avatar">
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
          exact
          flat 
          v-for="item in menuItems" :key="item.title"
          router
          :to="item.route"
        >
          <v-avatar class="mr-2" v-if="item.avatar && avatar"
            size="36px"
          >
            <img
              v-if="user.imgUrl"
              :src="user.imgUrl"
              alt="Avatar"
            >
          </v-avatar>
          <v-icon left v-if="!item.avatar || item.avatar && !avatar">
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
      if (this.isLoggedIn) {
        menuItems = [
          { title: 'View Meetups', icon: 'supervisor_account', route: '/admin/meetups' },
          { title: 'Add Meetup', icon: 'group_add', route: '/admin/meetups/new' },
          { title: 'Profile', icon: 'person', avatar: this.user.imgUrl, route: '/users/' + this.$store.getters.user.id }
        ]
      }
      return menuItems
    },
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    },
    user () {
      return this.$store.getters.user
    },
    avatar () {
      return this.$store.getters.user.imgUrl === '' ?false :true
    }
  },
  methods: {
    navTo() {

    }
  }
}
</script>
