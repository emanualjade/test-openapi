'use strict'

const { throwTestError, throwResponseError } = require('../errors')

// Handle errors coming from `deps`
const handleDepError = function(error, { opts: { stack, stackPath } }) {
  const { message } = error

  // Avoid repeating the same message several times across the stack
  if (message.includes(DEP_ERROR_MESSAGE) || message.includes(RECURSION_ERROR_MESSAGE)) {
    throw error
  }

  const stackError = stringifyStack(stack.slice(1))
  throwResponseError(
    `At '${stackPath}', this test uses ${stackError} ${DEP_ERROR_MESSAGE}:\n\n${message}`,
    { property: stackPath },
  )
}

// Check for infinite recursions
// A new stack is created for each test
const checkStack = function({
  depKey,
  deps,
  test: { testKey },
  opts,
  opts: { stack = [testKey] },
}) {
  const stackPath = getStackPath({ depKey, deps, opts })
  const newStack = [...stack, depKey]

  if (!stack.includes(depKey)) {
    return { ...opts, stack: newStack, stackPath }
  }

  const stackError = stringifyStack(newStack)
  throwTestError(
    `At '${stackPath}', this test uses '${newStack[1]}' ${RECURSION_ERROR_MESSAGE}:\n${stackError}`,
    { property: stackPath },
  )
}

// Property path to first `dep`
const getStackPath = function({ depKey, deps, opts: { stackPath } }) {
  if (stackPath !== undefined) {
    return stackPath
  }

  const { path } = deps.find(({ depKey: depKeyA }) => depKeyA === depKey)

  const stackPathA = path.join('.')
  return stackPathA
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
