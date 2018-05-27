'use strict'

const { pick } = require('lodash')

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

module.exports = {
  runTaskHandler,
}
