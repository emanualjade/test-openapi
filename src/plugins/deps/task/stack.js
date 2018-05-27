'use strict'

const { TestOpenApiError } = require('../../../errors')

// Check for infinite recursions
// A new stack is created for each task
const checkStack = function({
  depKey,
  taskKey,
  refs,
  stackInfo: { stack = [taskKey], stackPath } = {},
}) {
  const newStack = [...stack, depKey]
  const stackPathA = getStackPath({ depKey, stackPath, refs })

  if (!stack.includes(depKey)) {
    return { stack: newStack, stackPath: stackPathA }
  }

  const stackError = stringifyStack(newStack)
  const message = `At '${stackPathA}', this task uses '${
    newStack[1]
  }' ${RECURSION_ERROR_MESSAGE}:\n${stackError}`
  throw TestOpenApiError(message, { property: stackPath })
}

// Property path to first `dep`
// Only used for error messages
const getStackPath = function({ depKey, stackPath, refs }) {
  if (stackPath !== undefined) {
    return stackPath
  }

  const { path } = refs.find(({ depKey: depKeyA }) => depKeyA === depKey)

  const stackPathA = path.join('.')
  return stackPathA
}

// Handle errors coming from `deps`
const handleDepError = function(error, { stackInfo: { stack, stackPath } }) {
  const { message } = error

  // Avoid repeating the same message several times across the stack
  if (message.includes(DEP_ERROR_MESSAGE) || message.includes(RECURSION_ERROR_MESSAGE)) {
    throw error
  }

  const stackError = stringifyStack(stack.slice(1))
  throw new TestOpenApiError(
    `At '${stackPath}', this task uses ${stackError} ${DEP_ERROR_MESSAGE}:\n\n${message}`,
    { property: stackPath },
  )
}

const stringifyStack = function(stack) {
  return stack.map(key => `'${key}'`).join(' -> ')
}

const DEP_ERROR_MESSAGE = 'but this last task failed with the following error'
const RECURSION_ERROR_MESSAGE = 'but this results in an infinite recursion'

module.exports = {
  checkStack,
  handleDepError,
}
