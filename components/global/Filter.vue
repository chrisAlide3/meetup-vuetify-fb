<template>
  <div>
    <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-icon
            :class="activeFilter!=='All' ?'blue--text' :''"
            v-on="on"
          >
            filter_list
          </v-icon>
        </template>
        <v-list>
          <v-list-tile
            v-for="(item, index) in items"
            :key="index"
            @click="onFilterChange(item)"
          >
            <v-list-tile-title>
              <span :class="item.name===activeFilter ?'blue--text' : ''"><v-icon left>{{ item.icon }}</v-icon>{{ item.name }}</span>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    <!-- <v-select
      v-model="selectedItem"
      :items="items"
      solo
      flat
    ></v-select> -->
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    activeFilter: {
      type: String,
      required: true
    }
  },
  methods: {
    onFilterChange (field) {
      this.$emit('onFilterChange', field)
    }
  }
  // watch: {
  //   selectedItem (newValue, oldValue) {
  //     console.log('watch new/old: ', newValue + '/' + oldValue)
  //     if (newValue !== oldValue) {
  //       this.$emit('onFilterChange', newValue)
  //     }
      // this.$emit('onFilterChange', selectedItem)
  //   }
  // }
}
</script>
