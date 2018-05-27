'use strict'

const { pick, omit } = require('lodash')

const { TestOpenApiError } = require('./error')
const { normalizeError } = require('./normalize')

// Error handler for `it()`
const runTaskHandler = function({ errors, errorProperties }, error, task) {
  const errorA = addTaskName({ error, task })

  const errorB = addErrorProperties({ task, error: errorA, errorProperties })

  // Errors collection
  errors.push(errorB)

  throw errorB
}

// Add `error.task` name
const addTaskName = function({ error, task: { taskKey } }) {
  return normalizeError(error, { task: taskKey })
}

// Add each `plugin.properties.error`
const addErrorProperties = function({ task, error, errorProperties }) {
  const errorPropertiesA = pick(task, errorProperties)
  Object.assign(error, errorPropertiesA)

  return error
}

// Error thrown during task running
const createTaskError = function({ errors }) {
  const firstError = getTopError({ errors })

  const errorsA = errors.map(convertError)

  const error = new TestOpenApiError('', { ...firstError, errors: errorsA })
  return error
}

// Top-level error's properties are copied among one of the `errors` thrown
const getTopError = function({ errors }) {
  const bugError = errors.find(({ type }) => type === 'bug')
  if (bugError !== undefined) {
    return bugError
  }

  const [firstError] = errors

  const firstErrorA = convertPlainObject(firstError)
  return { ...firstErrorA, message: ERROR_MESSAGE }
}

const ERROR_MESSAGE = 'Some tasks failed'

// Convert ot plain object. Discard `error.name|stack` but not `error.message`
const convertError = function(error) {
  const errorA = convertPlainObject(error)
  const errorB = omit(errorA, ['name', 'stack'])
  return errorB
}

// Convert ot plain object. Must do it like this to keep `error.name|stack|message`
const convertPlainObject = function({ message, name, stack, ...error }) {
  return { ...error, message, name, stack }
}

module.exports = {
  runTaskHandler,
  createTaskError,
}
