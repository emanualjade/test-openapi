'use strict'

const { isEqual } = require('lodash')

const { TestOpenApiError, addErrorHandler } = require('../errors')
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
  validateEmptyTasks({ tasks })

  Object.entries(tasks).forEach(validateJson)
}

const validateEmptyTasks = function({ tasks }) {
  if (Object.keys(tasks).length !== 0) {
    return
  }

  throw new TestOpenApiError('No tasks were found')
}

// Tasks are constrained to JSON
// This also validates against circular references
const validateJson = function([key, task]) {
  const copy = eCloneTask({ task, key })
  // TODO: replace with util.isDeepStrictEqual() when we upgrade Node.js
  if (isEqual(task, copy)) {
    return
  }

  throw new TestOpenApiError(`Task '${key}' is not valid JSON`, { task: key })
}

const cloneTask = function({ task }) {
  return JSON.parse(JSON.stringify(task))
}

const cloneTaskHandler = function({ message }, { key }) {
  throw new TestOpenApiError(`Task '${key}' is not valid JSON: ${message}`, { task: key })
}

const eCloneTask = addErrorHandler(cloneTask, cloneTaskHandler)

module.exports = {
  validateTaskFile,
  validateTasks,
}
