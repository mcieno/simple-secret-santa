<template>
    <Logo />
    <Reveal />
    <div class="block"></div>
</template>

<script>
import Logo from './components/Logo.vue'
import Reveal from './components/Reveal.vue'

export default {
  name: 'App',
  components: {
    Reveal,
    Logo
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #efefef;
  padding-top: 60px;
}

html {
  background-color: #AB2328;
}
</style>

<style scoped>
.block {
  padding-bottom: 10vh;
}
</style>
