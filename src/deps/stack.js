'use strict'

// Handle errors coming from `deps`
const handleDepError = function(error, { opts: { stack } }) {
  const { message } = error

  // Avoid repeating the same message several times across the stack
  if (message.includes(DEP_ERROR_MESSAGE) || message.includes(RECURSION_ERROR_MESSAGE)) {
    throw error
  }

  const stackError = stringifyStack(stack.slice(1))
  // type: response
  throw new Error(`This test uses ${stackError} ${DEP_ERROR_MESSAGE}:\n\n${message}`)
}

// Check for infinite recursions
// A new stack is created for each test
const checkStack = function({ depKey, test: { testKey }, opts, opts: { stack = [testKey] } }) {
  const newStack = [...stack, depKey]

  if (!stack.includes(depKey)) {
    return { ...opts, stack: newStack }
  }

  const stackError = stringifyStack(newStack)
  // type: test
  throw new Error(`This test uses '${newStack[1]}' ${RECURSION_ERROR_MESSAGE}:\n${stackError}`)
}

const stringifyStack = function(stack) {
  return stack.map(key => `'${key}'`).join(' -> ')
}

const DEP_ERROR_MESSAGE = 'but this last test failed with the following error'
const RECURSION_ERROR_MESSAGE = 'but this results in an infinite recursion'

module.exports = {
  handleDepError,
  checkStack,
}
