'use strict'

const { throwTaskError, throwResponseError } = require('../../errors')

// Handle errors coming from `deps`
const handleDepError = function(
  error,
  {
    task: {
      dep: { stack, stackPath },
    },
  },
) {
  const { message } = error

  // Avoid repeating the same message several times across the stack
  if (message.includes(DEP_ERROR_MESSAGE) || message.includes(RECURSION_ERROR_MESSAGE)) {
    throw error
  }

  const stackError = stringifyStack(stack.slice(1))
  throwResponseError(
    `At '${stackPath}', this task uses ${stackError} ${DEP_ERROR_MESSAGE}:\n\n${message}`,
    { property: stackPath },
  )
}

// Check for infinite recursions
// A new stack is created for each task
const checkStack = function({ depKey, taskKey, dep: { refs, stack = [taskKey], stackPath } }) {
  const stackPathA = getStackPath({ depKey, stackPath, refs })
  const newStack = [...stack, depKey]

  if (!stack.includes(depKey)) {
    return { stack: newStack, stackPath: stackPathA }
  }

  const stackError = stringifyStack(newStack)
  throwTaskError(
    `At '${stackPath}', this task uses '${newStack[1]}' ${RECURSION_ERROR_MESSAGE}:\n${stackError}`,
    { property: stackPath },
  )
}

// Property path to first `dep`
const getStackPath = function({ depKey, stackPath, refs }) {
  if (stackPath !== undefined) {
    return stackPath
  }

  const { path } = refs.find(({ depKey: depKeyA }) => depKeyA === depKey)

  const stackPathA = path.join('.')
  return stackPathA
}

const stringifyStack = function(stack) {
  return stack.map(key => `'${key}'`).join(' -> ')
}

const DEP_ERROR_MESSAGE = 'but this last task failed with the following error'
const RECURSION_ERROR_MESSAGE = 'but this results in an infinite recursion'

module.exports = {
  handleDepError,
  checkStack,
}
