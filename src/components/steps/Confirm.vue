<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  user: {
    type: String,
    required: true
  },
})

const confirm = ref(false)

const emit = defineEmits(["confirm"])


function handleConfirm(event: Event): void {
  event.preventDefault()
  emit("confirm", true)
}

function handleDismiss(event: Event): void {
  event.preventDefault()
  emit("confirm", false)
}
</script>

<template>
  <p class="bold large">Hi {{ props.user }}!</p>
  <form action="#">
    <fieldset>
      <input
        class="large"
        name="submit"
        type="submit"
        value="🎁 Who's my santa?"
        @click='handleConfirm'
      />
      <input
        class="large inverted"
        name="submit"
        type="submit"
        value="&#8678; Go back!"
        @click='handleDismiss'
      />
    </fieldset>
  </form>
</template>

<style scoped>
input {
  min-width: 4cm;
  margin: 1%;
  padding: .7rem;
  width: 90vw;
  max-width: calc(12cm + 7vw);
}

input.inverted {
  background: #363958;
    border-radius: 4px;
    border-width: 0;
    box-shadow: 0px 2px 4px rgba(45, 35, 66, 0.4),
                0px 7px 13px -3px rgba(45, 35, 66, 0.3),
                inset 0px -3px 0px #d6d6e7;
    color: #fcfcfc;
}

input.inverted:hover {
    box-shadow: 0px 6px 12px rgba(45, 35, 66, 0.4),
                0px 7px 13px -3px rgba(45, 35, 66, 0.3),
                inset 0px -3px 0px #d6d6e7;
}

input.inverted:focus {
    box-shadow: 0px 6px 12px rgba(45, 35, 66, 0.4),
                0px 7px 13px -5px rgba(45, 35, 66, 0.3),
                inset 0px -5px 0px #d6d6e7;
}
</style>
