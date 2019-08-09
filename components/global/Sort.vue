<template>
  <div>
    <span class="blue--text">Sort by:</span>
    <v-btn v-for="(button) in sortButtons" :key="button"
       small
       flat
       class="ma-0 pa-0"
       @click="onSortChange(button)"
    >
    {{button}}
      <v-icon v-if="button === activeSort.name && activeSort.order === 'desc'"
        class="blue--text"
      >
      arrow_drop_up
      </v-icon>

      <v-icon v-else
        :class="button === activeSort.name && activeSort.order==='asc' ?'blue--text' :''"
      >
      arrow_drop_down
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  // data () {
  //   return {
  //     activeSort: {
  //       field: '',
  //       order: '',
  //       active: true
  //     }
  //   }
  // },
  props: {
    sortButtons: {
      type: Array,
      required: true
    },
    activeSort: {
      type: Object,
      required: true
    }
  },
  created () {
    console.log(this.sortButtons)
  //   for (let index = 0; index < this.sortButtons.length; index++) {
  //     if (this.sortButtons[index].order !== '') {
  //       this.activeSort.field = this.sortButtons[index].name
  //       this.activeSort.order = this.sortButtons[index].order
  //       break
  //     }
  //   }
  //         console.log(this.activeSort)
  },
  methods: {
    onSortChange (field) {
      console.log('sort.vue', field)
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
