<template>
    <div style='width: 250px;height: 200px;font-size:30px'>
      <div style='float:right;margin-right:50px'>{{ output }}</div>
      <br>
      <button @click='addNumber("1")'>1</button>
      <button @click='addNumber("2")'>4</button>
      <button @click='addNumber("3")'>3</button>
      <button @click='addOperator(" + ")'>+</button>
      <button @click='addOperator(" - ")'>-</button>
      <button @click='backspace'><-</button>
      <br>
      <button @click='addNumber("4")'>4</button>
      <button @click='addNumber("5")'>5</button>
      <button @click='addNumber("6")'>6</button>
      <button @click='addOperator(" * ")'>*</button>
      <button @click='addOperator(" / ")'>/</button>
      <button @click='clear'>c</button>
      <br>
      <button @click='addNumber("7")'>7</button>
      <button @click='addNumber("8")'>8</button>
      <button @click='addNumber("9")'>9</button>
      <button @click='addNumber("0")'>0</button>
      <button @click='addDecimalPoint'>.</button>
      <button @click='eval'>=</button>
      <br>
      <button @click='addOpenParenthesis'>(</button>
      <button @click='addCloseParenthesis'>)</button>
      <button @click='flipSign'>+/-</button>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'output',
    ])
  },

  methods: {
    ...mapMutations([
      'increment',
      'addNumber',
      'addOpenParenthesis',
      'addCloseParenthesis',
      'backspace',
      'addOperator',
      'addDecimalPoint',
      'eval',
      'clear',
      'flipSign',
      'checkForError',
      'checkForZero'
    ])
  }
}
</script>
<style scoped>
    button {
        font-size:20px
    }
</style>
