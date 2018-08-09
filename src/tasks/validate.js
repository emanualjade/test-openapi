'use strict'

const { TestOpenApiError } = require('../errors')
const { isObject } = require('../utils')

// Make sure task files are not empty
const validateTaskFile = function({ tasks, path }) {
  if (isObject(tasks)) {
    return
  }

  throw new TestOpenApiError(`Task file '${path}' should be an object not a ${typeof tasks}`)
}

// Validate syntax of task files
const validateTasks = function({ tasks }) {
  if (Object.keys(tasks).length !== 0) {
    return
  }

  throw new TestOpenApiError('No tasks were found')
}

module.exports = {
  validateTaskFile,
  validateTasks,
}
