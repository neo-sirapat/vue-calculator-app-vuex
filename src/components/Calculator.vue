<template>
    <div style='width: 250px;height: 200px;font-size:30px'>
      <div style='float:right;margin-right:50px'>{{ output }}</div>
      <br>
      <button @click='addNumber("1")'>1</button>
      <button @click='addNumber("2")'>2</button>
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
export default {
  data () {
    return {
      inputs: ['0']
    }
  },
  computed: {
    output () {
      var output = ''
      for (var input of this.inputs) {
        output += input
      }
      return output
    },
    num_free_open_parentheses () {
      var numOpenParentheses = 0
      var numCloseParentheses = 0
      for (var input of this.inputs) {
        if (input === '(') {
          numOpenParentheses += 1
        } else if (input === ')') {
          numCloseParentheses += 1
        }
      }
      return numOpenParentheses - numCloseParentheses
    }
  },

  methods: {
    addNumber (number) {
      this.checkForError()
      this.checkForZero()
      if (this.inputs.length === 0) {
        this.inputs.push(number)
      // if the number to be added isn't zero and the last number isn't zero and there isn't a operator preceding that, add the number
      } else if (!(number === '0' && (this.inputs[this.inputs.length - 1] === '0' &&
      (this.inputs[this.inputs.length - 2] === ' + ' || this.inputs[this.inputs.length - 2] === ' - ' ||
      this.inputs[this.inputs.length - 2] === ' * ' || this.inputs[this.inputs.length - 2] === ' / ')))) {
        // delete zeroes before operators
        if (this.inputs[this.inputs.length - 1] === '0' &&
        (this.inputs[this.inputs.length - 2] === ' + ' || this.inputs[this.inputs.length - 2] === ' - ' ||
        this.inputs[this.inputs.length - 2] === ' * ' || this.inputs[this.inputs.length - 2] === ' / ')) {
          this.inputs.splice(-1, 1)
        }
        this.inputs.push(number)
      }
    },
    addOpenParenthesis () {
      this.checkForError()
      this.checkForZero()
      this.inputs.push('(')
    },
    addCloseParenthesis () {
      // feature: can't add a close parenthesis without a free open parenthesis
      if (this.num_free_open_parentheses > 0) {
        this.inputs.push(')')
      }
    },
    backspace () {
      if (this.inputs.length > 0) {
        this.inputs.splice(-1, 1)
        if (this.inputs.length === 0) {
          this.inputs = ['0']
        }
      }
    },
    addOperator (operator) {
      this.checkForError()
      // feature: can't have 2 consecutive operators so if the last input was an operator, we replace that operator
      var lastEl = this.inputs[this.inputs.length - 1]
      if (lastEl === ' + ' || lastEl === ' - ' || lastEl === ' * ' || lastEl === ' / ') {
        this.inputs.pop(lastEl)
      }
      this.inputs.push(operator)
    },
    addDecimalPoint () {
      // feature: only 1 decimal point allowed per number so addtional presses are ignored
      var stop = false
      var i = this.inputs.length - 1
      var decimalPointCount = 0
      while (!stop) {
        var input = this.inputs[i]
        if (i < 0) {
          stop = true
        } else if (input === ' + ' || input === ' - ' || input === ' * ' || input === ' / ') {
          stop = true
        } else if (input === '.') {
          decimalPointCount += 1
        }
        i -= 1
      }
      if (decimalPointCount === 0) {
        this.inputs.push('.')
      }
    },
    eval () {
      var computedResult = ''
      var errored = false
      try {
        // if output is an Error, preserve that
        if (this.output === 'Error') {
          throw new Error()
        } else if (this.output !== '') { // if the output is non empty, evaluate it (gotta have this otherwise an empty input to eval will throw an error)
          // feature: if the last element is an operator, ignore it
          var lastEl = this.inputs[this.inputs.length - 1]
          if (lastEl === ' + ' || lastEl === ' - ' || lastEl === ' * ' || lastEl === ' / ') {
            this.inputs.pop(lastEl)
          }
          computedResult = global.eval(this.output).toString()
        }
      } catch (err) {
        this.inputs = ['Error']
        errored = true
      }
      if (!errored) {
        this.inputs = []
        if (computedResult === 'Infinity') {
          this.inputs.push('Infinity')
        } else {
          for (var char of computedResult) {
            this.inputs.push(char)
          }
        }
      }
    },
    clear () {
      this.inputs = ['0']
    },
    flipSign () {
      var stop = false
      var i = this.inputs.length - 1
      while (!stop) {
        var input = this.inputs[i]
        if (i < 0) {
          this.inputs.splice(0, 0, ' - ')
          stop = true
        } else if (input === ' - ') {
          if (i === 0 || this.inputs[i - 1] === ' - ' || this.inputs[i - 1] === ' + ' ||
          this.inputs[i - 1] === ' * ' || this.inputs[i - 1] === ' / ') {
            this.inputs.splice(i, 1)
          } else {
            this.inputs.splice(i, 1, ' + ')
          }
          stop = true
        } else if (input === ' * ' || input === ' / ') {
          this.inputs.splice(i + 1, 0, ' - ')
          stop = true
        } else if (input === ' + ') {
          this.inputs.splice(i, 1, ' - ')
          stop = true
        }
        i -= 1
      }
    },
    checkForError () {
      if (this.output === 'Error') {
        this.inputs = []
      }
    },
    checkForZero () {
      if (this.output === '0') {
        this.inputs = []
      }
    }
  }
}
</script>
<style scoped>
    button {
        font-size:20px
    }
</style>
