<template>
  <div>
    <!-- Sort-buttons on bigger screens -->
    <div v-if="sortBarStyle === 'button'" class="hidden-sm-and-down">
      <span class="blue--text">Sort by:</span>
      <v-btn v-for="(button) in sortButtons" :key="button"
        small
        flat
        class="ma-0 pa-0"
        @click="onSortChange(button)"
      >
      {{button}}
        <v-icon v-if="button === activeSort.name && activeSort.orderDesc"
          class="blue--text"
        >
        arrow_drop_up
        </v-icon>

        <v-icon v-else
          :class="button === activeSort.name && activeSort.orderAsc ?'blue--text' :''"
        >
        arrow_drop_down
        </v-icon>
      </v-btn>
    </div>
    <!-- Sort-Menu on smaller screens or icon on prop sortBarStyle -->
    <div :class="sortBarStyle==='button' ?'hidden-sm-and-up' :''">
      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-icon
            v-on="on"
            class="blue--text"
          >
            sort
          </v-icon>
        </template>
        <v-list>
          <v-list-tile
            v-for="button in sortButtons"
            :key="button"
            @click="onSortChange(button)"
          >
            <v-list-tile-title>
              <v-icon v-if="button === activeSort.name && activeSort.orderDesc"
                class="blue--text"
              >
              arrow_drop_up
              </v-icon>

              <v-icon v-else
                :class="button === activeSort.name && activeSort.orderAsc ?'blue--text' :''"
              >
              arrow_drop_down
              </v-icon>
              {{ button }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sortButtons: {
      type: Array,
      required: true
    },
    activeSort: {
      type: Object,
      required: true
    },
    sortBarStyle: {
      type: String, //icon, button
      required: true
    }
  },
  methods: {
    onSortChange (field) {
      this.$emit('onSortChange', field)
    }
  }
}
</script>

<style scoped>
  .active {
    background-color: blue;
  }
</style>
