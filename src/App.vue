<template>
  <div id="app">
    <calculator id='main'></calculator>
  </div>
</template>

<script>
import Calculator from './components/Calculator'

export default {
  name: 'App',
  components: {
    Calculator
  }
}
</script>

<style>
  #main {
    margin-top: 80px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
