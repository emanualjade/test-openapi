'use strict'

const { normalizeError } = require('./normalize')

// Error handler for `it()`
const runTaskHandler = function(error, { taskKey }, context, plugins, errors) {
  const errorA = normalizeError({ error, properties: { task: taskKey } })

  // Convert to plain object
  const errorB = { ...errorA, message: errorA.message }

  // Errors collection
  errors.push(errorB)

  throw errorA
}

// Error thrown during task running
const createTaskError = function({ errors }) {
  const error = new Error()

  const firstError = getTopError({ errors })

  Object.assign(error, { ...firstError, errors })

  return error
}

// Top-level error's properties (including `type`) are copied among one of the `errors` thrown
const getTopError = function({ errors }) {
  const bugError = errors.find(({ type }) => type === 'bug')
  if (bugError !== undefined) {
    return bugError
  }

  const [firstError] = errors

  if (firstError.type === undefined) {
    return { ...firstError, type: 'bug' }
  }

  return { ...firstError, message: ERROR_MESSAGE }
}

const ERROR_MESSAGE = 'Some tasks failed'

module.exports = {
  runTaskHandler,
  createTaskError,
}
