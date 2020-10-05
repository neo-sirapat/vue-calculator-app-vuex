<template>
  <div id="app">
    <calculator id='main'></calculator>
  </div>
</template>

<script>
import Calculator from './components/Calculator'
import Counter from './components/Counter'

export default {
  name: 'App',
  components: {
    Calculator,
    Counter
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
