<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  user: {
    type: String,
    required: true
  },
})
</script>

<template>
  <p class="bold large">🎁 Make a present to 🎁</p>
  <p class="bold large reveal">{{ props.user }}</p>
</template>

<style scoped>
.reveal {
  font-size: min(2rem + 2vw, 5rem)
}
</style>
