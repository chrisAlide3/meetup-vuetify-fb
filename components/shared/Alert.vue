<template>
  <v-alert
    dismissible
    type="error"
    :value="true"
    @input="onClose"
  >
    {{ message }}
  </v-alert>
</template>

<script>
export default {
  props: ['message'],
  methods: {
    onClose () {
      this.$emit('dismissed')
    }
  }
}
</script>
