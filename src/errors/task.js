'use strict'

const { normalizeError } = require('./normalize')

// Error handler for `it()`
const runTaskHandler = function({ errors }, error, task) {
  const errorA = addTask({ error, task })

  // Errors collection
  errors.push(errorA)

  throw errorA
}

// Add `error.task` and `error.taskName`
const addTask = function({ error, task: { taskKey: taskName, ...task } }) {
  return normalizeError(error, { taskName, task })
}

module.exports = {
  runTaskHandler,
}
