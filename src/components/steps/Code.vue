<script setup lang="ts">
import { ref } from 'vue'
import { Draw } from '../../draws'

const props = defineProps({
  draws: {
    type: Array as () => Draw[],
    required: true
  },
})

const emit = defineEmits(["user"])


function handleCodeChange(event: KeyboardEvent): void {
  const target = event.target as HTMLInputElement
  const inputs = target.parentElement?.
    querySelectorAll<HTMLInputElement>("input") ?? []

  const code = Array.from(inputs).map(i => i.value).join("")

  let match = props.draws.
    find(d => code === d.code)

  if (match) {
    emit("user", match.from, match.to)
  }
}

function handleCodeKeyup(event: KeyboardEvent): void {
  event.preventDefault()

  const target = event.target as HTMLInputElement
  const value = parseInt(event.key)

  let future: HTMLInputElement|null

  switch (true) {
  case event.key === "Backspace":
    target.value = ""
    future = target.previousElementSibling as HTMLInputElement
    break

  case ! isNaN(value):
    target.value = value.toString()
    future = target.nextElementSibling as HTMLInputElement
    break

  default:
    future = target
  }

  future?.focus()
}

function handleCodeFocus(event: FocusEvent): void {
  const target = event.target as HTMLInputElement
  target.value = ""
}
</script>

<template>
  <p class="bold large">What's your code?</p>
  <form action="#">
    <fieldset>
      <input
        class="huge bold"
        maxlength="1"
        minlength="1"
        name="code"
        pattern="[0-9]*"
        required
        type="text"
        v-for='i in 6'
        :key='i'
        @keydown='handleCodeKeyup'
        @focus='handleCodeFocus'
        @keyup='handleCodeChange'
      />
    </fieldset>
  </form>
</template>

<style scoped>
input {
  max-width: 1cm;
  min-width: 7.5vw;
  width: 10vw;
  margin: 1%;
  padding: .5vw;
}
</style>
