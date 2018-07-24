'use strict'

const { TestOpenApiError } = require('../errors')
const { isObject } = require('../utils')
const { checkJson } = require('../validation')

// Make sure task files are not empty
const validateTaskFile = function({ tasks, path }) {
  if (isObject(tasks)) {
    return
  }

  throw new TestOpenApiError(`Task file '${path}' should be an object not a ${typeof tasks}`)
}

// Validate syntax of task files
const validateTasks = function({ tasks }) {
  validateEmptyTasks({ tasks })

  Object.entries(tasks).forEach(validateJsonTask)
}

const validateEmptyTasks = function({ tasks }) {
  if (Object.keys(tasks).length !== 0) {
    return
  }

  throw new TestOpenApiError('No tasks were found')
}

const validateJsonTask = function([key, task]) {
  const getError = getJsonError.bind(null, key)
  checkJson({ value: task, getError })
}

const getJsonError = function(key, message) {
  return new TestOpenApiError(`Task '${key}' is not valid JSON${message}`, { task: key })
}

module.exports = {
  validateTaskFile,
  validateTasks,
}
