'use strict'

const { normalizeError } = require('./normalize')

// Error handler for `it()`
const runTasksHandler = function(error, { task: { taskKey }, config: { originalConfig }, errors }) {
  const errorA = normalizeError({ error, properties: { config: originalConfig, task: taskKey } })
  // Convert to plain object
  const errorB = { ...errorA, message: errorA.message }

  // Errors collection
  errors.push(errorB)

  throw errorA
}

// Error thrown during task running
const createTaskError = function({ errors }) {
  const error = new Error()

  const firstError = getFirstError({ errors })

  Object.assign(error, { ...firstError, errors })

  return error
}

// Top-level error's properties (including `type`) are copied among one of the `errors` thrown
const getFirstError = function({ errors }) {
  const type = TYPES.find(type => findError({ errors, type }) !== undefined) || DEFAULT_TYPE
  const error = findError({ errors, type })
  const message = type === 'bug' ? error.message : ERROR_MESSAGE
  return { ...error, message }
}

const TYPES = ['bug', 'config', 'specification', 'task', 'connect', 'response']

const DEFAULT_TYPE = 'bug'

const ERROR_MESSAGE = 'Some tasks failed'

const findError = function({ errors, type }) {
  return errors.find(({ type: typeA }) => typeA === type)
}

// Make sure every top-level exception has an `errors` property
const topNormalizeHandler = function(error) {
  const errorA = normalizeError({ error })
  if (Array.isArray(errorA.errors)) {
    throw errorA
  }

  // If only one error was thrown, use it in `errors`
  // Convert to plain object and make a shallow copy to avoid circular references
  const errorB = { ...errorA, message: errorA.message }
  // Make it the same shape as errors throw during task running
  errorA.errors = [errorB]

  throw errorA
}

module.exports = {
  runTasksHandler,
  createTaskError,
  topNormalizeHandler,
}
