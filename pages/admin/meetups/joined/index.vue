<template>
  <List :isAdmin="true" :joined="true" />
</template>

<script>
import List from '@/components/meetups/List'

export default {
  components: {
    List
  },
  middleware: ['checkAuth']
}
</script>

