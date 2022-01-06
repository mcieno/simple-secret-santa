<script setup lang="ts">
import { computed, ref } from 'vue'

import { Draw, getDraws } from '../draws'

import Code from "./steps/Code.vue"
import Confirm from "./steps/Confirm.vue"
import Result from "./steps/Result.vue"

const userFrom = ref("")
const userTo = ref("")
const confirmed = ref(false)

const draws = ref<Draw[]>([]);
window.addEventListener("DOMContentLoaded", async () => {
    draws.value = await getDraws()
})

const shouldDisplayCode = computed(() =>
  !userFrom.value
)

const shouldDisplayConfirmation = computed(() =>
  !shouldDisplayCode.value && !confirmed.value
)

const shouldDisplayResult = computed(() =>
  !shouldDisplayCode.value && !shouldDisplayConfirmation.value
)

function handleEmitUser(emittedFrom: string, emittedTo: string) {
    userFrom.value = emittedFrom
    userTo.value = emittedTo
}

function handleEmitConfirm(emittedConfirmed: boolean) {
    confirmed.value = emittedConfirmed

    if (!confirmed.value) {
        userFrom.value = ""
        userTo.value = ""
    }
}
</script>

<template>
  <section>
    <Code v-if='shouldDisplayCode' v-on:user='handleEmitUser' :draws='draws' />
    <Confirm v-if='shouldDisplayConfirmation' v-on:confirm='handleEmitConfirm' :user='userFrom' />
    <Result v-if='shouldDisplayResult' :user='userTo' />
  </section>
</template>
