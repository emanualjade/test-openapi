'use strict'

const { pick } = require('lodash')

const { normalizeError } = require('./normalize')

// Error handler for `it()`
const runTaskHandler = async function({ errors, errorProperties }, error, task) {
  const errorA = addTaskName({ error, task })

  const errorB = addErrorProperties({ task, error: errorA, errorProperties })

  // Errors collection
  errors.push(errorB)

  throw errorB
}

// Add `error.task` name
const addTaskName = function({ error, task: { taskKey } }) {
  return normalizeError({ error, properties: { task: taskKey } })
}

// Add each `plugin.properties.error`
const addErrorProperties = function({ task, error, errorProperties }) {
  const errorPropertiesA = pick(task, errorProperties)
  Object.assign(error, errorPropertiesA)

  return error
}

// Error thrown during task running
const createTaskError = function({ errors }) {
  const error = new Error()

  const firstError = getTopError({ errors })

  const errorsA = errors.map(convertPlainObject)

  Object.assign(error, { ...firstError, errors: errorsA })

  return error
}

// Top-level error's properties (including `type`) are copied among one of the `errors` thrown
const getTopError = function({ errors }) {
  const bugError = errors.find(({ type }) => type === 'bug')
  if (bugError !== undefined) {
    return bugError
  }

  const [{ name, message, stack, type, ...firstError }] = errors

  if (type === undefined) {
    return { ...firstError, name, message, stack, type: 'bug' }
  }

  return { ...firstError, name, message: ERROR_MESSAGE, stack, type }
}

const ERROR_MESSAGE = 'Some tasks failed'

// Convert ot plain object. Discard `error.name|stack` but not `error.message`
const convertPlainObject = function({ message, ...error }) {
  return { ...error, message }
}

module.exports = {
  runTaskHandler,
  createTaskError,
}
