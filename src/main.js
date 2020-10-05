// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    inputs: ['0']
  },
  getters: {
    output (state) {
      var output = ''
      for (var input of state.inputs) {
        output += input
      }
      return output
    },
    numFreeOpenParentheses (state) {
      var numOpenParentheses = 0
      var numCloseParentheses = 0
      for (var input of state.inputs) {
        if (input === '(') {
          numOpenParentheses += 1
        } else if (input === ')') {
          numCloseParentheses += 1
        }
      }
      return numOpenParentheses - numCloseParentheses
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    addNumber (state, number) {
      store.commit('checkForError')
      store.commit('checkForZero')
      if (state.inputs.length === 0) {
        state.inputs.push(number)
      // if the number to be added isn't zero and the last number isn't zero and there isn't a operator preceding that, add the number
      } else if (!(number === '0' && (state.inputs[state.inputs.length - 1] === '0' &&
      (state.inputs[state.inputs.length - 2] === ' + ' || state.inputs[state.inputs.length - 2] === ' - ' ||
      state.inputs[state.inputs.length - 2] === ' * ' || state.inputs[state.inputs.length - 2] === ' / ')))) {
        // delete zeroes before operators
        if (state.inputs[state.inputs.length - 1] === '0' &&
        (state.inputs[state.inputs.length - 2] === ' + ' || state.inputs[state.inputs.length - 2] === ' - ' ||
        state.inputs[state.inputs.length - 2] === ' * ' || state.inputs[state.inputs.length - 2] === ' / ')) {
          state.inputs.splice(-1, 1)
        }
        state.inputs.push(number)
      }
    },
    addOpenParenthesis (state) {
      store.commit('checkForError')
      store.commit('checkForZero')
      state.inputs.push('(')
    },
    addCloseParenthesis (state) {
      // feature: can't add a close parenthesis without a free open parenthesis
      if (store.getters.numFreeOpenParentheses > 0) {
        state.inputs.push(')')
      }
    },
    backspace (state) {
      if (state.inputs.length > 0) {
        state.inputs.splice(-1, 1)
        if (state.inputs.length === 0) {
          state.inputs = ['0']
        }
      }
    },
    addOperator (state, operator) {
      store.commit('checkForError')
      // feature: can't have 2 consecutive operators so if the last input was an operator, we replace that operator
      var lastEl = state.inputs[state.inputs.length - 1]
      if (lastEl === ' + ' || lastEl === ' - ' || lastEl === ' * ' || lastEl === ' / ') {
        state.inputs.pop(lastEl)
      }
      state.inputs.push(operator)
    },
    addDecimalPoint (state) {
      // feature: only 1 decimal point allowed per number so addtional presses are ignored
      var stop = false
      var i = state.inputs.length - 1
      var decimalPointCount = 0
      while (!stop) {
        var input = state.inputs[i]
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
        state.inputs.push('.')
      }
    },
    eval (state) {
      var computedResult = ''
      var errored = false
      try {
        // if output is an Error, preserve that
        if (store.getters.output === 'Error') {
          throw new Error()
        } else if (store.getters.output !== '') { // if the output is non empty, evaluate it (gotta have this otherwise an empty input to eval will throw an error)
          // feature: if the last element is an operator, ignore it
          var lastEl = state.inputs[state.inputs.length - 1]
          if (lastEl === ' + ' || lastEl === ' - ' || lastEl === ' * ' || lastEl === ' / ') {
            state.inputs.pop(lastEl)
          }
          computedResult = global.eval(store.getters.output).toString()
        }
      } catch (err) {
        state.inputs = ['Error']
        errored = true
      }
      if (!errored) {
        state.inputs = []
        if (computedResult === 'Infinity') {
          state.inputs.push('Infinity')
        } else {
          for (var char of computedResult) {
            state.inputs.push(char)
          }
        }
      }
    },
    clear (state) {
      state.inputs = ['0']
    },
    flipSign (state) {
      var stop = false
      var i = state.inputs.length - 1
      while (!stop) {
        var input = state.inputs[i]
        if (i < 0) {
          state.inputs.splice(0, 0, ' - ')
          stop = true
        } else if (input === ' - ') {
          if (i === 0 || state.inputs[i - 1] === ' - ' || state.inputs[i - 1] === ' + ' ||
          state.inputs[i - 1] === ' * ' || state.inputs[i - 1] === ' / ') {
            state.inputs.splice(i, 1)
          } else {
            state.inputs.splice(i, 1, ' + ')
          }
          stop = true
        } else if (input === ' * ' || input === ' / ') {
          state.inputs.splice(i + 1, 0, ' - ')
          stop = true
        } else if (input === ' + ') {
          state.inputs.splice(i, 1, ' - ')
          stop = true
        }
        i -= 1
      }
    },
    checkForError (state) {
      if (store.getters.output === 'Error') {
        state.inputs = []
      }
    },
    checkForZero (state) {
      if (store.getters.output === '0') {
        state.inputs = []
      }
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  components: { App },
  template: '<App/>'
})
