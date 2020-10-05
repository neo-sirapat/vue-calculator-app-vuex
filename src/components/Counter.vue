<template>
  <div>
    <p>{{ count }}</p>
    <p>
      <button @click="increment">+</button>
    </p>
  </div>
</template>
<script>
export default {
  computed: {
    count () {
      return this.$store.state.count
    }
  },
  methods: {
    increment () {
      this.$store.commit('increment')
      console.log(this.$store.state.count)
    }
  }
}
</script>
<style scoped>
</style>
