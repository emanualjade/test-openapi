'use strict'

const { TestOpenApiError } = require('../errors')
const { isObject, getPath } = require('../utils')

const { parseInput } = require('./serialize')

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

// Make sure input tasks are valid JSON
const validateJsonTask = function([key, task]) {
  parseInput(task, throwParseError.bind(null, key))
}

const throwParseError = function(key, { message, value, path }) {
  const property = getPath(['task', ...path])
  throw new TestOpenApiError(`Task '${key}' ${message}`, { task: key, value, property })
}

module.exports = {
  validateTaskFile,
  validateTasks,
}
