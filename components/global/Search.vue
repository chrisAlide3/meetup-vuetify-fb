<template>
  <v-text-field
    v-model="searchString"
    placeholder="Search"
    solo
  >
    </v-text-field>
</template>

<script>
export default {
  computed: {
    searchString: {
      get: function () {
        return this.$store.getters.searchString
      },
      set: function (value) {
        this.$store.dispatch('setSearchString', value)
      }
    }
  }
}
</script>
