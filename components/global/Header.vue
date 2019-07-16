<template>
  <nav>
    <!-- Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
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
          v-for="item in items"
          :key="item.title"
          @click="$router.push(item.route)"
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
        <v-btn flat @click="$router.push('/')">
          Meetups
        </v-btn>
      </v-toolbar-title>

      <v-spacer />

      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat @click="$router.push('/meetups')">
          <v-icon left>
            list
          </v-icon>
          Meetups
        </v-btn>
        <v-btn flat @click="$router.push('/auth?isLogin=false')">
          <v-icon left>
            account_circle
          </v-icon>
          Register
        </v-btn>
        <v-btn flat @click="$router.push('/auth?isLogin=true')">
          <v-icon left>
            exit_to_app
          </v-icon>
          Login
        </v-btn>

      </v-toolbar-items>
      <!-- <v-list-tile
        v-for="item in items"
        :key="item.title"
        class="hidden-sm-and-down"
        @click="$router.push(item.route)"
      > -->
        <!-- <v-list-tile-action>
          <v-icon>
            {{ item.icon }}
          </v-icon>
        </v-list-tile-action> -->

        <!-- <v-list-tile-content>
          <v-layout row>
            <v-flex>
              <v-icon>
                {{ item.icon }}
              </v-icon>
              <v-list-tile-title>
                {{ item.title }}
              </v-list-tile-title>
            </v-flex>
          </v-layout>
        </v-list-tile-content>
      </v-list-tile> -->
    </v-toolbar>

  </nav>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: 'Home', icon: 'home', route: '/' },
        { title: 'Meetups', icon: 'list', route: '/meetups' },
        { title: 'Login', icon: 'exit_to_app', route: '/auth?isLogin=true' },
        { title: 'Register', icon: 'account_circle', route: '/auth?isLogin=false' }
      ],
      right: null,
      drawer: false
    }
  },

  methods: {
    navTo() {

    }
  }
}
</script>
