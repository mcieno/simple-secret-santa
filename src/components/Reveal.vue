<template>
  <div class="columns is-mobile is-centered">
    <div v-if="!selected" class="column">
      <h1 class="title">Who are you?</h1>
      <div class="select is-large">
        <select v-model="selected" required>
          <option value="">Choose...</option>
          <option
            v-for="participant in participants"
            v-bind:key="participant"
            :value="participant"
            >{{ participant }}</option>
        </select>
      </div>
    </div>
    <div v-else-if="selected && !confirmed" class="column">
      <h1 class="title">So you are {{ selected }}, huh?</h1>
      <div class="block">
        <button v-on:click="confirmed = true" class="button is-light is-large">&#x1F389; Yes, who's my santa?</button>
      </div>
      <div class="block">
        <button v-on:click="selected = ''" class="button is-dark is-large">&#x1F480; Nope, take me back!</button>
      </div>
    </div>
    <div v-else class="column">
      <h1 class="title">Dear {{ selected }},</h1>
      <h2 class="subtitle">make a present to...</h2>
      <h1 class="title is-1">&#x1F381; {{ pairs.filter(pair => pair.from === selected)[0].to }} &#x1F381;</h1>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Reveal',
  props: [
    ''
  ],

  data () {
    return {
      participants: [],
      pairs: [],
      selected: '',
      confirmed: false
    }
  },

  created () {
    fetch('/pairs.json')
      .then(response => response.json())
      .then(pairs => {
        this.participants = Array.from(pairs).map(pair => atob(pair.from)).sort()
        this.pairs = Array.from(pairs).map(pair => ({ from: atob(pair.from), to: atob(pair.to) }))
      })
      .catch()
  },

  watch: {
    progressBar () {
      this.progress += 1
    }
  }
}
</script>


<style scoped>
.title {
  color: #efefef;
}

.subtitle {
  color: #dfdfdf;
}
</style>
